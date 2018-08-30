# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'System codes' do
  it_behaves_like :authenticated do
    scenario 'system codes are fetch once per page load' do
      stub_request(:get, ferb_api_url(FerbRoutes.screenings_path))
        .and_return(json_body([].to_json, status: 200))
      stub_request(:post, ferb_api_url(FerbRoutes.intake_screenings_path))
        .and_return(json_body({ id: '1' }.to_json, status: 200))
      stub_request(:get, ferb_api_url(FerbRoutes.lov_path))
        .and_return(json_body([].to_json, status: 200))
      stub_request(:get, ferb_api_url(FerbRoutes.intake_screening_path(1)))
        .and_return(json_body({}.to_json, status: 200))
      stub_request(:get, ferb_api_url(FerbRoutes.screening_history_of_involvements_path(1)))
        .and_return(json_body([].to_json, status: 200))
      visit root_path(accessCode: access_code)
      click_button 'Start Screening'
      within '#screening-information-card' do
        fill_in('Title/Name of Screening', with: 'Need to wait for request to finish')
      end
      expect(a_request(:get, ferb_api_url(FerbRoutes.lov_path))).to have_been_made.once
    end
  end
end
