# frozen_string_literal: true

require 'rails_helper'

describe PersonSearchByAddress do
  let(:address_query) do
    hash = { city: 'city_search_term',
             county: 'county_search_term',
             street: 'street_number_and_name_search_term' }
    described_class.new(search_address: hash)
  end

  describe '.query' do
    context 'returns hash' do
      it 'with query' do
        expect(address_query.query).to eq address_only_query[:query]
      end
    end
  end

  describe '.query' do
    context 'returns hash' do
      it 'with query' do
        address_query.search_term = nil
        address_query.county = nil
        expect(address_query.query).to eq address_city_only[:query]
      end
    end
  end

  let(:search_term) { 'city_search_term' }
  let(:address_only_query) do
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "_uid": 'desc'
        }
      ],
      "query": {
        "bool": {
          "must": [
            {
              "nested": {
                "path": 'addresses',
                "query": {
                  "bool": {
                    "must": [
                      {
                        "match": {
                          "addresses.autocomplete_searchable_address": {
                            "query": 'street_number_and_name_search_term',
                            "operator": 'and'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.autocomplete_city": {
                            "query": 'city_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.county.description": {
                            "query": 'county_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.last_known": {
                            "query": 'true'
                          }
                        }
                      }
                    ]
                  }
                },
                "inner_hits": {
                  "highlight": {
                    "fields": {
                      "addresses.autocomplete_city": {},
                      "addresses.autocomplete_searchable_address": {},
                      "addresses.county.description": {}
                    }
                  }
                }
              }
            }
          ],
          "should": [
            {
              "nested": {
                "path": 'addresses',
                "query": {
                  "bool": {
                    "should": [
                      {
                        "match": {
                          "addresses.searchable_address": {
                            "query": 'street_number_and_name_search_term',
                            "operator": 'and',
                            "boost": '3'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.city": {
                            "query": 'city_search_term',
                            "boost": '3'
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      },
      "_source": [
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
        'addresses.county',
        'addresses.state_code',
        'addresses.zip',
        'addresses.type',
        'addresses.legacy_descriptor',
        'addresses.phone_numbers.number',
        'addresses.phone_numbers.type',
        'phone_numbers.id',
        'phone_numbers.number',
        'phone_numbers.type',
        'highlight',
        'legacy_descriptor',
        'sensitivity_indicator',
        'race_ethnicity'
      ],
      "highlight": {
        "order": 'score',
        "number_of_fragments": '10',
        "require_field_match": 'false',
        "fields": {
          "autocomplete_search_bar": {
            "matched_fields": [
              'autocomplete_search_bar',
              'autocomplete_search_bar.phonetic',
              'autocomplete_search_bar.diminutive'
            ]
          },
          "searchable_date_of_birth": {}
        }
      }
    }
  end
  let(:address_city_only) do
    {
      "query": {
        "bool": {
          "must": [
            {
              "nested": {
                "path": 'addresses',
                "query": {
                  "bool": {
                    "must": [
                      {
                        "match": {
                          "addresses.autocomplete_city": {
                            "query": 'city_search_term'
                          }
                        }
                      },
                      {
                        "match": {
                          "addresses.last_known": {
                            "query": 'true'
                          }
                        }
                      }
                    ]
                  }
                },
                "inner_hits": {
                  "highlight": {
                    "fields": {
                      "addresses.autocomplete_city": {},
                      "addresses.autocomplete_searchable_address": {},
                      "addresses.county.description": {}
                    }
                  }
                }
              }
            }
          ],
          "should": [
            {
              "nested": {
                "path": 'addresses',
                "query": {
                  "bool": {
                    "should":
                      [{
                        "match": {
                          "addresses.city": {
                            "query": 'city_search_term',
                            "boost": '3'
                          }
                        }
                      }]
                  }
                }
              }
            }
          ]
        }
      }
    }
  end
end
