# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'API call' do
  let(:screening) do
    { id: '1' }
  end

  it_behaves_like :authenticated do
    context 'responds with unauthorized error' do
      scenario 'redirectes user to login with full callback path' do
        stub_empty_relationships
        stub_empty_history_for_screening(screening)
        stub_request(:get, ferb_api_url(FerbRoutes.screenings_path)).and_return(
          json_body([], status: 200)
        )

        visit root_path(accessCode: access_code)
        screening_path = screening_path(screening[:id])
        redirect_url = CGI.escape("#{page.current_url.split('/?')[0]}#{screening_path}")
        login_url = "#{auth_login_url}#{redirect_url}"

        stub_request(:get, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
          .and_return(json_body('I failed', status: 401))
        visit screening_path(id: screening[:id], params: { bar: 'foo' }, accessCode: access_code)

        # have_current_path waits for the async call to finish, but doesn't verify url params
        # comparing the current_url to login_url compares the full strings
        # though these expectations look identical, we really do need both of them
        expect(page).to have_current_path(login_url, url: true)
        expect(page.current_url).to eq(login_url)
      end
    end

    scenario 'responds with server error and include incident ids' do
      stub_request(:get, ferb_api_url(FerbRoutes.screenings_path))
        .and_return(json_body('I failed', status: 500))
      stub_empty_relationships
      visit root_path(accessCode: access_code)
      expect(page).to have_content(
        /Something went wrong, sorry! Please try your last action again. \(Ref #:.*\)/
      )
    end
  end

  scenario 'returns a success' do
    stub_and_visit_show_screening(screening)
    expect(page.current_url).to have_content screening_path(screening[:id])
  end
end
