# frozen_string_literal: true

require 'rails_helper'

feature 'Validate Investigation Contact' do
  before do
    stub_system_codes
    visit new_investigation_contact_path(investigation_id: '123ABC')

    # TODO: remove this once we can consistently have a fresh page for these specs
    page.driver.browser.navigate.refresh
  end

  scenario 'user sees that status is required' do
    expect(page).not_to have_content 'Please enter a contact status'

    select '', from: 'Status'
    blur_field
    expect(page).to have_content 'Please enter a contact status'

    select 'Attempted', from: 'Status'
    expect(page).not_to have_content 'Please enter a contact status'
  end

  scenario 'user sees that date/time is required' do
    expect(page).not_to have_content 'The date and time cannot be in the future.'
    expect(page).not_to have_content 'Please enter a contact date'

    fill_in_datepicker 'Date/Time', with: '', blur: false
    expect(page).not_to have_content 'Please enter a contact date'
    blur_field
    expect(page).to have_content 'Please enter a contact date'

    fill_in_datepicker 'Date/Time', with: 2.years.from_now
    expect(page).to have_content 'The date and time cannot be in the future.'

    fill_in_datepicker 'Date/Time', with: 2.years.ago
    expect(page).not_to have_content 'The date and time cannot be in the future.'
    expect(page).not_to have_content 'Please enter a contact date'
  end

  scenario 'user sees that purpose is required' do
    expect(page).not_to have_content 'Please enter a contact purpose'

    select '', from: 'Purpose'
    blur_field
    expect(page).to have_content 'Please enter a contact purpose'

    select 'Investigate Referral', from: 'Purpose'
    expect(page).not_to have_content 'Please enter a contact purpose'
  end
end