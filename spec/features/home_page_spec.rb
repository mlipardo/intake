# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'
feature 'home page' do
  let(:screenings) do
    [
      {
        id: 1,
        name: "It's bigger on the inside",
        assignee: 'Clara Oswald',
        started_at: '2016-08-12T00:00:00.157Z',
        screening_decision: 'promote_to_referral',
        screening_decision_detail: nil,
        screening_status: 'open'
      },
      {
        id: 2,
        started_at: '2017-08-17T23:02:06.680Z',
        screening_decision: 'promote_to_referral',
        screening_decision_detail: 'immediate',
        screening_status: 'submitted'
      },
      {
        id: 3,
        started_at: '2018-08-17T21:02:35.454Z',
        screening_decision: 'promote_to_referral',
        screening_decision_detail: '3_days',
        screening_status: 'submitted'
      },
      {
        id: 4,
        started_at: '2018-08-17T17:02:45.103Z',
        screening_decision: 'promote_to_referral',
        screening_decision_detail: '5_days',
        screening_status: 'submitted'
      },
      {
        id: 5,
        started_at: '2018-08-17T22:59:54.689Z',
        screening_decision: 'promote_to_referral',
        screening_decision_detail: '10_days',
        screening_status: 'submitted'
      },
      {
        id: 6,
        name: 'A',
        started_at: '2018-01-10T00:00:00.000-07:00',
        screening_decision: 'screen_out',
        screening_decision_detail: 'evaluate_out',
        screening_status: 'submitted'
      },
      {
        id: 7,
        name: 'Z',
        started_at: '2017-02-12T00:00:00.000-08:00',
        screening_decision: 'screen_out',
        screening_decision_detail: 'information_request',
        screening_status: 'submitted'
      },
      {
        id: 8,
        started_at: '2016-03-11T00:00:00.000-07:00',
        screening_decision: 'screen_out',
        screening_decision_detail: 'consultation',
        screening_status: 'submitted'
      },
      {
        id: 9,
        started_at: nil,
        screening_decision: 'screen_out',
        screening_decision_detail: 'other',
        screening_status: 'submitted'
      }
    ]
  end

  it_behaves_like :authenticated do
    context 'when screenings is not enabled' do
      around do |example|
        Feature.run_with_deactivated(:screenings) do
          example.run
        end
      end

      scenario 'hide list of screenings' do
        visit root_path(accessCode: access_code)
        expect(
          a_request(:get, ferb_api_url(FerbRoutes.screenings_path))
        ).to_not have_been_made
        expect(page).not_to have_button 'Start Screening'
        expect(page).not_to have_css 'table'
      end
    end

    context 'when snapshot is not enabled' do
      around do |example|
        Feature.run_with_deactivated(:snapshot) do
          example.run
        end
      end

      scenario 'hide start snapshot button' do
        stub_request(:get, ferb_api_url(FerbRoutes.screenings_path)).and_return(
          json_body([], status: 200)
        )
        visit root_path(accessCode: access_code)
        expect(page).not_to have_button 'Start Snapshot'
      end
    end

    context 'when both screenings and snapshot are enabled' do
      before(:each) do
        stub_request(:get, ferb_api_url(FerbRoutes.screenings_path)).and_return(
          json_body(screenings.to_json, status: 200)
        )
        visit root_path(accessCode: access_code)
      end

      it 'screenings can be sorted by clickable name, status, and report date and time' do
        expect(page).to have_title 'Intake'
        expect(page).to have_button 'Start Screening'

        within 'thead' do
          expect(page).to have_css('th', text: 'Screening Name')
          expect(page).to have_css('th', text: 'Type/Decision')
          expect(page).to have_css('th', text: 'Status')
          expect(page).to have_css('th', text: 'Assignee')
          expect(page).to have_css('th', text: 'Report Date and Time')
        end

        rows = all('tr')
        within 'tbody' do
          # 'default ordered by "Report Date and Time", in descending order'
          within rows[1] do
            expect(page).to have_content('Other submitted', normalize_ws: true)
            expect(find_all('td').last).to have_content('')
          end
          within rows[2] do
            expect(page).to have_content('Consultation submitted', normalize_ws: true)
            expect(find_all('td').last).to have_text('03/10/2016', normalize_ws: true)
          end
          within rows[3] do
            expect(page).to have_text(
              "It's bigger on the inside open Clara Oswald 08/11/2016 5:00 PM",
              normalize_ws: true
            )
            expect(page).to have_css('a', text: "It's bigger on the inside")
            expect(find_all('td').last).to have_text('08/11/2016', normalize_ws: true)
          end
          within rows[4] do
            expect(page).to have_content('Z')
            expect(page).to have_content('Information request submitted', normalize_ws: true)
            expect(find_all('td').last).to have_text('02/12/2017', normalize_ws: true)
          end
          within rows[5] do
            expect(page).to have_content('Immediate submitted', normalize_ws: true)
            expect(find_all('td').last).to have_text('08/17/2017', normalize_ws: true)
          end
          within rows[6] do
            expect(page).to have_content('A')
            expect(page).to have_content('Evaluate out submitted', normalize_ws: true)
            expect(find_all('td').last).to have_text('01/09/2018', normalize_ws: true)
          end
          within rows[7] do
            expect(page).to have_content('5 days submitted', normalize_ws: true)
            expect(find_all('td').last).to have_text('08/17/2018', normalize_ws: true)
          end
          within rows[8] do
            expect(page).to have_content('3 days submitted', normalize_ws: true)
            expect(find_all('td').last).to have_text('08/17/2018', normalize_ws: true)
          end
          within rows[9] do
            expect(page).to have_content('10 days submitted', normalize_ws: true)
            expect(find_all('td').last).to have_text('08/17/2018', normalize_ws: true)
          end
        end

        within 'thead' do
          find('th', text: 'Report Date and Time').find('.order').click
        end

        rows = all('tr')
        within 'tbody' do
          # 'ordered list by "Report Date and Time", ascending order'
          within rows[1] do
            expect(find_all('td').last).to have_text('08/17/2018')
          end
          within rows[2] do
            expect(find_all('td').last).to have_text('08/17/2018')
          end
          within rows[3] do
            expect(find_all('td').last).to have_text('08/17/2018')
          end
          within rows[4] do
            expect(find_all('td').last).to have_text('01/09/2018')
          end
          within rows[5] do
            expect(find_all('td').last).to have_text('08/17/2017')
          end
          within rows[6] do
            expect(find_all('td').last).to have_text('02/12/2017')
          end
          within rows[7] do
            expect(find_all('td').last).to have_text('08/11/2016')
          end
          within rows[8] do
            expect(find_all('td').last).to have_text('03/10/2016')
          end
          within rows[9] do
            expect(find_all('td').last).to have_content('')
          end
        end

        within 'thead' do
          find('th', text: 'Screening Name').find('.order').click
        end

        rows = all('tr')
        within 'tbody' do
          # 'ordered list by "Screening Name", descending order'
          within rows[1] do
            expect(page).to have_content('Z')
          end
          within rows[2] do
            expect(page).to have_content("It's bigger on the inside")
          end
          within rows[3] do
            expect(page).to have_content('A')
          end
        end

        within 'thead' do
          find('th', text: 'Screening Name').find('.order').click
        end

        rows = all('tr')
        within 'tbody' do
          # 'ordered list by "Screening Name", ascending order'
          within rows[7] do
            expect(page).to have_content('A')
          end
          within rows[8] do
            expect(page).to have_content("It's bigger on the inside")
          end
          within rows[9] do
            expect(page).to have_content('Z')
          end
        end

        rows = all('tr')
        within 'tbody' do
          # 'unordered list by "Status"'
          within rows[1] do
            expect(page).to have_content('submitted')
          end
          within rows[3] do
            expect(page).to have_content('submitted')
          end
        end

        within 'thead' do
          find('th', text: 'Status').find('.order').click
        end

        rows = all('tr')
        within 'tbody' do
          # 'ordered list by "Status", descending order'
          within rows[1] do
            expect(page).to have_content('submitted')
          end
          within rows[2] do
            expect(page).to have_content('submitted')
          end
        end

        within 'thead' do
          find('th', text: 'Status').find('.order').click
        end

        rows = all('tr')
        within 'tbody' do
          # 'ordered list by "Status", ascending order'
          within rows[1] do
            expect(page).to have_content('open')
          end
          within rows[2] do
            expect(page).to have_content('submitted')
          end
        end
      end
    end
  end
end
