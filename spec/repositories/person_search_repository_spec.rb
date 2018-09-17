# frozen_string_literal: true

require 'rails_helper'

describe PersonSearchRepository do
  let(:security_token) { 'my_security_token' }
  let(:params) do
    {
      search_term: 'hello world'
    }
  end

  describe '.search' do
    context 'when response from DORA is successful' do
      it 'returns status 200' do
        stub_request(:post, dora_api_url(ExternalRoutes.dora_people_light_index_path))
          .and_return(json_body(['hello world'], status: 200))

        result = described_class.search(params, security_token: security_token)
        expect(result).to eq ['hello world']
      end
    end

    context 'when response from DORA is unsuccessful' do
      it 'raise error when status not 200' do
        stub_request(:post, dora_api_url(ExternalRoutes.dora_people_light_index_path))
          .and_return(json_body(['Created'], status: 201))

        expect do
          described_class.search(params, security_token: security_token)
        end.to raise_error(TypeError)
      end
    end
  end

  describe '.find' do
    let(:id) { '123456788' }
    let(:hits) do
      { 'hits' => { 'hits' => [{ '_source' => { 'id' => id } }] } }
    end

    before(:each) do
      stub_request(:post, dora_api_url(ExternalRoutes.dora_people_light_index_path))
        .and_return(json_body(hits.to_json, status: 200))
    end

    context 'searching with no id' do
      it 'raises an error' do
        expect do
          described_class.find(nil, security_token: security_token)
        end.to raise_error('id is required')
      end
    end

    context 'searching with an id' do
      it 'returns the existing person' do
        result = described_class.find(id, security_token: security_token)
        expect(result['id']).to eq id
      end
    end
  end
end
