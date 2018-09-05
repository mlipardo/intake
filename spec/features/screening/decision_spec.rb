# frozen_string_literal: true

require 'rails_helper'

feature 'decision card' do
  let(:screening) do
    {
      id: '1',
      screening_decision: 'promote_to_referral',
      screening_decision_detail: '3_days',
      additional_information: 'this is why it is',
      incident_address: {},
      addresses: [],
      cross_reports: [],
      participants: [],
      allegations: [],
      safety_alerts: []
    }
  end

  before(:each) do
    stub_empty_history_for_screening(screening)
    stub_request(:get, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_relationships
    stub_empty_history_for_screening(screening)

    visit edit_screening_path(id: screening[:id])
  end

  scenario 'initial configuration, persisting data' do
    new_window = nil
    within '#decision-card.edit' do
      expect(page).to have_select('Screening Decision', options: [
                                    '',
                                    'Differential response',
                                    'Promote to referral',
                                    'Screen out'
                                  ])

      select 'Promote to referral', from: 'Screening Decision'
      expect(page).to have_select('Response Time', options: [
                                    '',
                                    'Immediate',
                                    '3 days',
                                    '5 days',
                                    '10 days'
                                  ])

      select 'Screen out', from: 'Screening Decision'
      expect(page).to have_select('Category', options: [
                                    '',
                                    'Evaluate out',
                                    'Information request',
                                    'Consultation',
                                    'Abandoned call',
                                    'Other'
                                  ])

      select 'Differential response', from: 'Screening Decision'
      expect(page).to have_field('Service Name', with: '')
      fill_in 'Service Name', with: 'Do not persist'

      select 'Screen out', from: 'Screening Decision'
      select 'Differential response', from: 'Screening Decision'
      expect(page).to have_field('Service Name', with: '')
      expect(page).to have_field('Additional Information', with: 'this is why it is')

      expect(page).to have_select('Access Restrictions', options: [
                                    'Do not restrict access',
                                    'Mark as Sensitive',
                                    'Mark as Sealed'
                                  ])

      expect(page).not_to have_field('Restrictions Rationale')
      select 'Mark as Sensitive', from: 'Access Restrictions'
      expect(page).to have_field('Restrictions Rationale')

      expect(page).to have_content('SDM Hotline Tool')
      expect(page).to have_content(
        'Determine Decision and Response Time by using Structured Decision Making'
      )

      expect(page).to have_content('Complete SDM')
      link_from_edit = find_link('Complete SDM')
      expect(link_from_edit[:href]).to eq 'https://ca.sdmdata.org/'
      expect(link_from_edit[:target]).to eq '_blank'
      click_button 'Cancel'
    end
    within '#decision-card.show' do
      link_from_show = find_link('Complete SDM')
      expect(link_from_show[:href]).to eq 'https://ca.sdmdata.org/'
      expect(link_from_show[:target]).to eq '_blank'
      change_href('complete_sdm', '/test')
      new_window = window_opened_by { click_link 'Complete SDM' }
      within_window new_window do
        expect(page).to have_current_path('/test')
      end
    end

    click_link 'Edit decision'
    screening.merge!(
      screening_decision: 'differential_response',
      screening_decision_detail: 'An arbitrary string',
      additional_information: 'I changed my decision rationale',
      restrictions_rationale: 'Someone in this screening has sensitive information',
      access_restrictions: 'sensitive'
    )
    stub_request(:put, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(proc {
        sleep 2
        json_body(screening.to_json)
      })

    within '#decision-card.edit' do
      expect(page).to have_select('Screening Decision', selected: 'Promote to referral')
      expect(page).to have_select('Response Time', selected: '3 days')
      expect(page).to have_select('Access Restrictions', selected: 'Do not restrict access')
      expect(page).to have_field('Additional Information', with: 'this is why it is')
      expect(page).to have_button('Save')
      expect(page).to have_button('Cancel')
      fill_in 'Additional Information', with: 'I changed my decision rationale'
      select 'Differential response', from: 'Screening Decision'
      fill_in 'Service Name', with: 'An arbitrary string'
      select 'Mark as Sensitive', from: 'Access Restrictions'
      fill_in 'Restrictions Rationale', with: 'Someone in this screening has sensitive information'
      click_button 'Save'
      expect(page).to have_button('Saving', disabled: true)
    end
    within '#decision-card.show', wait: 4 do
      expect(page).to have_content('SDM Hotline Tool')
      expect(page).to have_content(
        'Determine Decision and Response Time by using Structured Decision Making'
      )
      expect(page).to have_content('Complete SDM')
      expect(page).to have_content('Screening Decision')
      expect(page).to have_content('Differential response')
      expect(page).to have_content('Service Name')
      expect(page).to have_content('An arbitrary string')
      expect(page).to have_content('Additional Information')
      expect(page).to have_content('I changed my decision rationale')
      expect(page).to have_content('Sensitive')
      expect(page).to have_content('Someone in this screening has sensitive information')
    end
    expect(
      a_request(:put, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .with(body: hash_including(screening.as_json))
    ).to have_been_made
  end

  context 'Information to child welfare services decision option' do
    let(:valid_legacy_ui_id) { '0442-2654-1834-4001650' }
    let(:hoi_populated) do
      {
        referrals: [
          {
            id: '1234',
            start_date: '2016-11-14',
            legacy_descriptor: {
              legacy_ui_id: valid_legacy_ui_id
            }
          }
        ]
      }
    end

    let(:screening_contact) do
      {
        id: '1',
        screening_decision: 'information_to_child_welfare_services',
        screening_decision_detail: '',
        screening_contact_reference: '',
        additional_information: 'this is why it is',
        addresses: [],
        cross_reports: [],
        participants: [],
        allegations: [],
        safety_alerts: []
      }
    end

    scenario 'shows an extra field to store case or referral Id' do
      stub_request(
        :get,
        ferb_api_url(
          FerbRoutes.screening_history_of_involvements_path(screening[:id])
        )
      ).and_return(json_body(hoi_populated.to_json, status: 200))

      stub_request(
        :put,
        ferb_api_url(
          FerbRoutes.intake_screening_path(screening[:id])
        )
      ).and_return(json_body(screening_contact.to_json), status: 200)

      visit edit_screening_path(id: screening[:id])
      within '#decision-card.edit' do
        expect(page).to have_select('Screening Decision', options: [
                                      '',
                                      'Differential response',
                                      'Information to child welfare services',
                                      'Promote to referral',
                                      'Screen out'
                                    ])
        select 'Information to child welfare services', from: 'Screening Decision'
        expect(page).to have_field('Case or Referral Id')

        # valid chars and error handling
        fill_in 'Case or Referral Id', with: 'a lot of invalid chars'
        expect(page).to have_field('Case or Referral Id', with: '')
        fill_in 'Case or Referral Id', with: '1111-222'
        expect(page).to have_field('Case or Referral Id', with: '1111-222')
        fill_in 'Staff Name', with: 'Joe Doe'
        expect(page).to have_content('Please enter a valid Case or Referral Id')

        fill_in 'Case or Referral Id', with: ''
        fill_in 'Staff Name', with: 'Jane Doe'
        expect(page).to have_content('Please enter a valid Case or Referral Id')
        fill_in 'Case or Referral Id', with: valid_legacy_ui_id
        expect(page).to_not have_content('Please enter a valid Case or Referral Id')

        # clearing the field after switching options
        select 'Screen out', from: 'Screening Decision'
        expect(page).to_not have_field('Case or Referral Id')

        select 'Information to child welfare services', from: 'Screening Decision'
        expect(page).to have_field('Case or Referral Id', with: '')
        click_button 'Save'
      end

      within '#decision-card.show' do
        expect(page.find('div.show-label', text: 'Case or Referral Id')[:class])
          .to include('required')
        expect(page).to have_text(
          'Please enter a valid Case or Referral Id'
        )
        click_link 'Edit'
      end

      valid_screening_contact = screening_contact.merge(
        screening_contact_reference: valid_legacy_ui_id
      )

      stub_request(
        :put,
        ferb_api_url(
          FerbRoutes.intake_screening_path(screening[:id])
        )
      ).and_return(json_body(valid_screening_contact.to_json), status: 200)

      within '#decision-card.edit' do
        expect(page).to have_field('Case or Referral Id', with: '')
        fill_in 'Case or Referral Id', with: valid_legacy_ui_id
        click_button 'Save'
      end

      within '#decision-card.show' do
        expect(page.find('div.show-label', text: 'Case or Referral Id')[:class])
          .to include('required')
        expect(page).to_not have_text('Please enter a valid Case or Referral Id')
      end
    end
  end

  scenario 'user edits information details and click cancel' do
    within '#decision-card.edit' do
      fill_in 'Additional Information', with: 'I changed my decision rationale'
      select 'Screen out', from: 'Screening Decision'
      select 'Consultation', from: 'Category'
      click_button 'Cancel'
    end

    within '#decision-card.show' do
      expect(page.find('div.show-label', text: 'Response Time')[:class]).to include('required')
      expect(page).to have_content('Promote to referral')
      expect(page).to have_content('Response Time')
      expect(page).to have_content('3 days')
      expect(page).to have_content('this is why it is')
    end

    # And the cancel effect is persistent
    click_link 'Edit decision'
    within '#decision-card.edit' do
      expect(page.find('label', text: 'Response Time')[:class]).to include('required')
      expect(page).to have_field('Screening Decision', with: 'promote_to_referral')
      expect(page).to have_field('Response Time', with: '3_days')
      expect(page).to have_field('Additional Information', with: 'this is why it is')
    end
  end
end
