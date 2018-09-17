# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::PeopleController do
  let(:security_token) { 'security_token' }
  let(:session) do
    { security_token => security_token }
  end
  let(:people) { double(:search_response, as_json: 'search response') }
  let(:params) do
    { search_term: 'foobarbaz', search_address:  { street: '123 main street' } }
  end

  describe '#index' do
    context 'when search_after is not provied as a param' do
      before do
        allow(PersonSearchRepository).to receive(:search)
          .with(params.as_json, security_token: security_token).and_return(people)
      end

      it 'searches for people and renders a json with person attributes' do
        get :index, params: params, session: session
        expect(response).to be_successful
        expect(response.body).to eq('"search response"')
      end
    end

    context 'when search_after is provied as a param' do
      before do
        params[:search_after] = 'hello world'
        allow(PersonSearchRepository).to receive(:search)
          .with(params.as_json, security_token: security_token).and_return(people)
      end

      it 'searches for people and renders a json with person attributes' do
        get :index, params: params, session: session
        expect(response).to be_successful
        expect(response.body).to eq('"search response"')
      end
    end
  end

  describe '#show' do
    let(:id) { '1' }
    before do
      allow(ParticipantRepository).to receive(:authorize)
        .with(security_token, id)
        .and_return(nil)
      allow(PersonSearchRepository).to receive(:find)
        .with(id, security_token: security_token)
        .and_return(people)
    end

    it 'searches for a person and renders a json with person attributes' do
      get :show, params: { id: id }, session: session
      expect(response).to be_successful
      expect(response.body).to eq('"search response"')
    end
  end
end
