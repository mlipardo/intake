# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

describe PersonSearchRepository do
  let(:security_token) { 'my_security_token' }

  describe '.search' do
    let(:search_term) { 'Robert Barathian' }
    let(:number_of_fragments) { 10 }
    let(:low_boost) { 2 }
    let(:medium_boost) { 3 }
    let(:high_boost) { 7 }
    let(:no_boost) { 1 }
    let(:auto_bar_highlight) do
      { 'matched_fields':
        ['autocomplete_search_bar',
         'autocomplete_search_bar.phonetic',
         'autocomplete_search_bar.diminutive'] }
    end

    let(:source) do
      [
        'id',
        'legacy_source_table',
        'first_name',
        'middle_name',
        'last_name',
        'name_suffix',
        'gender',
        'date_of_birth',
        'date_of_death',
        'ssn',
        'languages',
        'races',
        'ethnicity',
        'client_counties',
        'addresses.id',
        'addresses.effective_start_date',
        'addresses.street_name',
        'addresses.street_number',
        'addresses.city',
        'addresses.state_code',
        'addresses.zip',
        'addresses.type',
        'addresses.legacy_descriptor',
        'addresses.phone_numbers.number',
        'addresses.phone_numbers.type',
        'legacy_descriptor',
        'highlight',
        'phone_numbers.id',
        'phone_numbers.number',
        'phone_numbers.type',
        'sensitivity_indicator',
        'race_ethnicity',
        'open_case_responsible_agency_code'
      ]
    end
    let(:highlight) do
      { order: 'score',
        number_of_fragments: number_of_fragments,
        require_field_match: false,
        fields: {
          'autocomplete_search_bar': auto_bar_highlight,
          'searchable_date_of_birth': {}
        } }
    end

    let(:query) do
      {
        bool: {
          must: [{
            bool: {
              should: [
                {
                  match: {
                    autocomplete_search_bar: {
                      query: 'robert barathian',
                      operator: 'and',
                      boost: low_boost
                    }
                  }
                },
                {
                  match: {
                    'autocomplete_search_bar.diminutive': {
                      query: 'robert barathian',
                      operator: 'and',
                      boost: no_boost
                    }
                  }
                },
                {
                  match: {
                    'autocomplete_search_bar.phonetic': {
                      query: 'robert barathian',
                      operator: 'and',
                      boost: no_boost
                    }
                  }
                }
              ]
            }
          }],
          should: [
            {
              match: {
                autocomplete_search_bar: {
                  query: 'robert barathian',
                  operator: 'and',
                  boost: medium_boost
                }
              }
            },
            { match: { first_name: { query: 'robert barathian',
                                     boost: high_boost } } },
            { match: { last_name: { query: 'robert barathian',
                                    boost: high_boost } } },
            { match: { 'first_name.phonetic': { query: 'robert barathian',
                                                boost: low_boost } } },
            { match: { 'last_name.phonetic': { query: 'robert barathian',
                                               boost: low_boost } } },
            { match: { date_of_birth_as_text: { query: 'robert barathian',
                                                boost: high_boost } } },
            { match: { ssn: { query: 'robert barathian',
                              boost: high_boost } } }
          ]
        }
      }
    end

    let(:query_clients_only) do
      query_clone = query.clone
      query_clone[:bool][:must].push(
        match: {
          'legacy_descriptor.legacy_table_name': 'CLIENT_T'
        }
      )
      query_clone
    end

    let(:results) do
      {
        'hits' =>  {
          'total' => 456,
          'hits' =>  [
            { '_source' => { 'id' => '1' } },
            { '_source' => { 'id' => '2' } }
          ]
        }
      }
    end

    context 'when response from DORA is successful' do
      let(:response) { double(:response, body: results, status: 200) }

      context 'when search_after is present' do
        let(:search_after) { %w[one two] }
        let(:request_body) do
          {
            size: 10,
            track_scores: true,
            sort: [{ _score: 'desc', _uid: 'desc' }],
            search_after: search_after,
            query: query_clients_only,
            _source: source,
            highlight: highlight
          }
        end

        it 'returns the people search results' do
          expect(DoraAPI).to receive(:make_api_call)
            .with(
              security_token,
              '/dora/people-summary/person-summary/_search',
              :post,
              request_body
            ).and_return(response)
          expect(
            described_class.search(
              security_token: security_token,
              search_term: search_term,
              search_after: search_after,
              is_client_only: true
            )
          ).to eq(response.body)
        end
      end

      context 'when search_after is not present' do
        let(:request_body) do
          {
            size: 10,
            track_scores: true,
            sort: [{ _score: 'desc', _uid: 'desc' }],
            query: query_clients_only,
            _source: source,
            highlight: highlight
          }
        end

        it 'returns the people search results' do
          expect(DoraAPI).to receive(:make_api_call)
            .with(
              security_token,
              '/dora/people-summary/person-summary/_search',
              :post,
              request_body
            ).and_return(response)
          expect(
            described_class.search(
              security_token: security_token,
              search_term: search_term,
              search_after: nil,
              is_client_only: true
            )
          ).to eq(response.body)
        end
      end

      context 'when search all persons' do
        let(:request_body) do
          {
            size: 10,
            track_scores: true,
            sort: [{ _score: 'desc', _uid: 'desc' }],
            query: query,
            _source: source,
            highlight: highlight
          }
        end

        it 'returns the people search results' do
          expect(DoraAPI).to receive(:make_api_call)
            .with(
              security_token,
              '/dora/people-summary/person-summary/_search',
              :post,
              request_body
            ).and_return(response)
          expect(
            described_class.search(
              security_token: security_token,
              search_term: search_term,
              search_after: nil,
              is_client_only: false
            )
          ).to eq(response.body)
        end
      end
    end

    context 'when response from DORA is unsuccessful' do
      let(:response) { double(:response, body: 'Some error payload', status: 401) }
      let(:request_body) do
        {
          size: 10,
          track_scores: true,
          sort: [{ _score: 'desc', _uid: 'desc' }],
          query: query_clients_only,
          _source: source,
          highlight: highlight
        }
      end
      before do
        allow(DoraAPI).to receive(:make_api_call)
          .with(security_token, '/dora/people-summary/person-summary/_search', :post, request_body)
          .and_return(response)
      end
      it 'raises an error' do
        expect do
          described_class.search(
            security_token: security_token,
            search_term: search_term,
            search_after: nil,
            is_client_only: true
          )
        end.to raise_error('Some error payload')
      end
    end
  end

  describe '.find' do
    subject { described_class.find(security_token: security_token, id: id) }

    context 'searching with no id' do
      let(:id) { nil }

      it 'raises an error' do
        expect do
          subject
        end.to raise_error('id is required')
      end
    end

    context 'searching with an id' do
      let(:id) { '123456788' }
      let(:hits) { [{ '_source' => { 'id' => '123456788' } }] }
      let(:response_body) do
        {
          'took' => 1,
          'timed_out' => false,
          '_shards' => {
            'total' => 5,
            'successful' => 5,
            'failed' => 0
          },
          'hits' => {
            'total' => 0,
            'max_score' => nil,
            'hits' => hits
          }
        }
      end
      let(:response) { double(:response, body: response_body, status: 200) }

      before do
        path = ExternalRoutes.dora_people_light_index_path
        fields = %w[
          id legacy_source_table first_name middle_name last_name name_suffix gender
          date_of_birth date_of_death ssn languages addresses phone_numbers legacy_descriptor
          sensitivity_indicator race_ethnicity
        ]
        query = {
          query: {
            bool: {
              must: [
                {
                  match: {
                    id: '123456788'
                  }
                }
              ]
            }
          },
          _source: fields
        }

        expect(DoraAPI).to receive(:make_api_call)
          .with(security_token, path, :post, query)
          .and_return(response)
      end

      it 'returns the existing person' do
        expect(subject['id']).to eq('123456788')
      end
    end
  end
end
