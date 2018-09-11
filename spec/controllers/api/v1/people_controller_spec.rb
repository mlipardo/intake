# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::PeopleController do
  let(:security_token) { 'security_token' }
  let(:session) do
    { security_token => security_token }
  end

  describe '#search' do
    let(:people) { double(:search_response, as_json: 'search response') }

    context 'when search_after is not provied as a param' do
      let(:params) do
        { search_term: 'foobarbaz',
          search_address: '123 main street' }
      end
      before do
        allow(PersonSearchRepository).to receive(:search)
          .with(
            security_token: security_token,
            search_term: params[:search_term],
            search_address: params[:search_address],
            search_after: nil,
            is_client_only: false
          ).and_return(people)
      end

      it 'searches for people and renders a json with person attributes' do
        process :search, method: :get, params: params, session: session
        expect(response).to be_successful
        expect(response.body).to eq('"search response"')
      end
    end

    context 'when search_after is provied as a param' do
      let(:params) do
        {
          search_term: 'foobarbaz',
          search_address: '123 main street',
          search_after: %w[one two]
        }
      end
      before do
        allow(PersonSearchRepository).to receive(:search)
          .with(
            security_token: security_token,
            search_term: params[:search_term],
            search_address: params[:search_address],
            search_after: params[:search_after],
            is_client_only: false
          ).and_return(people)
      end

      it 'searches for people and renders a json with person attributes' do
        process :search, method: :get, params: params, session: session
        expect(response).to be_successful
        expect(response.body).to eq('"search response"')
      end
    end
  end

  describe '#show' do
    let(:person) { double(:search_response, as_json: 'search response') }
    let(:id) { '1' }

    before do
      allow(ParticipantRepository).to receive(:authorize)
        .with(security_token, id)
        .and_return(nil)
      allow(PersonSearchRepository).to receive(:find)
        .with(security_token: security_token, id: id)
        .and_return(person)
    end

    it 'searches for a person and renders a json with person attributes' do
      process :show, method: :get, params: { id: id }, session: session
      expect(response).to be_successful
      expect(response.body).to eq('"search response"')
    end
  end
end
