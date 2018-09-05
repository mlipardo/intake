# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'search card' do
  let(:existing_screening) do
    {
      id: '1',
      incident_address: {},
      addresses: [],
      cross_reports: [],
      participants: [],
      allegations: [],
      safety_alerts: []
    }
  end
  let(:date_of_birth) { 15.years.ago.to_date }
  before do
    stub_request(
      :get, ferb_api_url(FerbRoutes.intake_screening_path(existing_screening[:id]))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    stub_empty_relationships
    stub_empty_history_for_screening(existing_screening)
    stub_system_codes
    visit edit_screening_path(id: existing_screening[:id])
  end

  scenario 'display include address checkbox' do
    within '#search-card', text: 'Search' do
      expect(page).to have_content 'Include Address'
      expect(find(:checkbox, 'Include Address')).to_not be_checked
    end
  end

  scenario 'when include address is checked, address input field and search button is displayed' do
    within '#search-card', text: 'Search' do
      find('label', text: /\AInclude Address\z/).click
      expect(page).to have_content 'Address'
      expect(page).to have_button 'Search'
    end
  end

  scenario 'search for a person when include address is checked and search button is clicked' do
    within '#search-card', text: 'Search' do
      find('label', text: /\AInclude Address\z/).click
    end
    search_response = PersonSearchResponseBuilder.build do |response|
      response.with_total(1)
      response.with_hits do
        [
          PersonSearchResultBuilder.build do |builder|
            builder.with_first_name('Marge')
            builder.with_middle_name('Jacqueline')
            builder.with_last_name('Simpson')
            builder.with_name_suffix('md')
            builder.with_gender('female')
            builder.with_date_of_birth(date_of_birth)
            builder.with_ssn('123231234')
            builder.with_languages do
              [
                LanguageSearchResultBuilder.build('French') do |language|
                  language.with_primary true
                end,
                LanguageSearchResultBuilder.build('Italian')
              ]
            end
            builder.with_phone_number(number: '9712876774', type: 'Home')
            builder.with_addresses do
              [
                AddressSearchResultBuilder.build do |address|
                  address.with_street_number('123')
                  address.with_street_name('Fake St')
                  address.with_state_code('NY')
                  address.with_city('Springfield')
                  address.with_zip('11222')
                  address.with_phone_number(number: '6035550123', type: 'Home')
                  address.with_type do
                    AddressTypeSearchResultBuilder.build('Home')
                  end
                end
              ]
            end
            builder.with_race_and_ethnicity do
              RaceEthnicitySearchResultBuilder.build do |race_ethnicity|
                race_ethnicity.with_hispanic_origin_code('Y')
                race_ethnicity.with_hispanic_unable_to_determine_code('')
                race_ethnicity.with_race_codes do
                  [
                    RaceCodesSearchResultBuilder.build('White'),
                    RaceCodesSearchResultBuilder.build('American Indian or Alaska Native')
                  ]
                end
              end
            end
            builder.with_sensitivity
            builder.with_sort('1')
          end
        ]
      end
    end
    stub_person_search(search_term: 'Ma', person_response: search_response)

    within '#search-card', text: 'Search' do
      fill_in 'Search for any person', with: 'Ma'
      expect(page).to_not have_content date_of_birth.strftime('%-m/%-d/%Y')
      expect(page).to_not have_content '15 yrs old'
      expect(page).to_not have_content 'Female, White, American Indian or Alaska Native'
      expect(page).to_not have_content 'Hispanic/Latino'
      expect(page).to_not have_content 'Language'
      expect(page).to_not have_content 'French (Primary), Italian'
      expect(page).to_not have_content 'Home(603) 555-0123'
      expect(page).to_not have_content 'SSN'
      expect(page).to_not have_content '1234'
      expect(page).to_not have_content '123-23-1234'
      expect(page).to_not have_content 'Home123 Fake St, Springfield, NY 11222'
      expect(page).to_not have_content 'Sensitive'
      click_button 'Search'
    end

    within_person_search_result(name: 'Marge Jacqueline Simpson, MD') do
      expect(page).to have_content date_of_birth.strftime('%-m/%-d/%Y')
      expect(page).to have_content '15 yrs old'
      expect(page).to have_content 'Female, White, American Indian or Alaska Native'
      expect(page).to have_content 'Hispanic/Latino'
      expect(page).to have_content 'Language'
      expect(page).to have_content 'French (Primary), Italian'
      expect(page).to have_content 'Home(603) 555-0123'
      expect(page).to have_content 'SSN'
      expect(page).to have_content '1234'
      expect(page).to have_content '123-23-1234'
      expect(page).to have_content 'Home123 Fake St, Springfield, NY 11222'
      expect(page).to have_content 'Sensitive'
      expect(page).to_not have_content 'Sealed'
    end
  end
end
