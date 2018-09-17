# frozen_string_literal: true

require 'rails_helper'

describe QueryBuilder do
  describe '.is_client_only?' do
    context 'is_client_only is true' do
      it 'return true' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'true')
        expect(qb.is_client_only).to be true
      end
    end

    context 'is_client_only is blank' do
      it 'return true' do
        qb = described_class.new(search_term: 'hello')
        expect(qb.is_client_only).to be true
      end
    end

    context 'is_client_only is blank' do
      it 'return false' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'false')
        expect(qb.is_client_only).to be false
      end
    end
  end
  describe '.must' do
    context 'is_client_only is true' do
      before(:each) do
        Rails.configuration.intake[:client_only_search] = true
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only "true"' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'true')
        expect(qb.must.last).to \
          include(match: { "legacy_descriptor.legacy_table_name": 'CLIENT_T' })
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only blank' do
        qb = described_class.new(search_term: 'hello')
        expect(qb.must.last).to \
          include(match: { "legacy_descriptor.legacy_table_name": 'CLIENT_T' })
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only "false"' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'false')
        expect(qb.must.last).to \
          include(match: { "legacy_descriptor.legacy_table_name": 'CLIENT_T' })
      end
    end

    context 'is_client_only is false' do
      before(:each) do
        Rails.configuration.intake[:client_only_search] = false
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only "true"' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'true')
        expect(qb.must.last).to \
          include(match: { "legacy_descriptor.legacy_table_name": 'CLIENT_T' })
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only blank' do
        qb = described_class.new(search_term: 'hello')
        expect(qb.must.last).to  \
          include(match: { "legacy_descriptor.legacy_table_name": 'CLIENT_T' })
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only "false"' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'false')
        expect(qb.must.last).not_to  \
          include(match: { "legacy_descriptor.legacy_table_name": 'CLIENT_T' })
      end
    end
  end

  describe '.build_query' do
    context 'when search_term and search_address are present' do
      it 'returns query with person and address' do
        result = described_class.new(search_term: search_term,
                                     search_address: search_address).build_query
        expect(result[:_source].sort).to eq person_and_address[:_source].sort
        expect(result[:size]).to eq person_and_address[:size]
        expect(result[:sort]).to eq person_and_address[:sort]
        expect(result[:track_scores]).to eq person_and_address[:track_scores]
        expect(result[:highlight]).to eq person_and_address[:highlight]
        expect(result[:query]).to eq person_and_address[:query]
      end
    end

    context 'when search_address are blank' do
      it 'returns query with person only' do
        skip 'Need clarificaiton from Mariam on person_and_address_with_no_address_highlighting'
        result = described_class.new(search_term: search_term).build_query
        expect(result[:query]).to eq person_and_address_with_no_address_highlighting[:query]
      end
    end
  end

  let(:search_term) { 'person_search_term' }
  let(:search_address) do
    { city: 'city_search_term',
      county: 'county_search_term',
      street: 'street_number_and_name_search_term' }
  end

  let(:person_and_address) do
    { "size": '10',
      "track_scores": 'true',
      "sort": [{
        "_score": 'desc',
        "_uid": 'desc'
      }],
      "query": { "bool": {
        "must": [{
          "bool": {
            "should": [{
              "match": {
                "autocomplete_search_bar": {
                  "query": 'person_search_term',
                  # "fuzziness": 'AUTO',
                  "operator": 'and',
                  "boost": '2'
                }
              }
            }, {
              "match": {
                "autocomplete_search_bar.diminutive": {
                  "query": 'person_search_term',
                  "operator": 'and',
                  "boost": '1'
                }
              }
            }, {
              "match": {
                "autocomplete_search_bar.phonetic": {
                  "query": 'person_search_term',
                  "operator": 'and',
                  "boost": '1'
                }
              }
            }]
          }
        }, {
          "match": {
            "legacy_descriptor.legacy_table_name": 'CLIENT_T'
          }
        }, {
          "nested": {
            "path":
            'addresses',
            "query": { "bool": {
              "must": [{
                "match": {
                  "addresses.autocomplete_searchable_address": {
                    "query": 'street_number_and_name_search_term',
                    "operator": 'and'
                  }
                }
              }, {
                "match": {
                  "addresses.autocomplete_city": {
                    "query": 'city_search_term'
                  }
                }
              }, {
                "match": {
                  "addresses.county.description": {
                    "query": 'county_search_term'
                  }
                }
              }, {
                "match": {
                  "addresses.last_known": {
                    "query": 'true'
                  }
                }
              }]
            } },
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
        }], "should": [{
          "match": {
            "autocomplete_search_bar": {
              "query": 'person_search_term',
              "operator": 'and',
              "boost": '3'
            }
          }
        }, {
          "match": {
            "first_name": {
              "query": 'person_search_term',
              "boost": '7'
            }
          }
        }, {
          "match": {
            "last_name": {
              "query": 'person_search_term',
              "boost": '7'
            }
          }
        }, {
          "match": {
            "first_name.phonetic": {
              "query": 'person_search_term',
              "boost": '2'
            }
          }
        }, {
          "match": {
            "last_name.phonetic": {
              "query": 'person_search_term',
              "boost": '2'
            }
          }
        }, {
          "match": {
            "date_of_birth_as_text": {
              "query": 'person_search_term',
              "boost": '7'
            }
          }
        }, {
          "match": {
            "ssn": {
              "query": 'person_search_term',
              "boost": '7'
            }
          }
        }, {
          "nested": {
            "path": 'addresses',
            "query": {
              "bool": {
                "should": [{
                  "match": {
                    "addresses.searchable_address": {
                      "query": 'street_number_and_name_search_term',
                      "operator": 'and',
                      "boost": '3'
                    }
                  }
                }, {
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
        }]
      } },
      "_source": _source,
      "highlight": highlight }
  end
  let(:person_and_address_with_no_address_highlighting) do
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
              "bool": {
                "should": [
                  {
                    "match": {
                      "autocomplete_search_bar": {
                        "query": 'person_search_term',
                        "fuzziness": 'AUTO',
                        "operator": 'and',
                        "boost": '2'
                      }
                    }
                  },
                  {
                    "match": {
                      "autocomplete_search_bar.diminutive": {
                        "query": 'person_search_term',
                        "operator": 'and',
                        "boost": '1'
                      }
                    }
                  },
                  {
                    "match": {
                      "autocomplete_search_bar.phonetic": {
                        "query": 'person_search_term',
                        "operator": 'and',
                        "boost": '1'
                      }
                    }
                  }
                ]
              }
            },
            {
              "match": {
                "legacy_descriptor.legacy_table_name": 'CLIENT_T'
              }
            },
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
                }
              }
            }
          ],
          "should": [
            {
              "match": {
                "autocomplete_search_bar": {
                  "query": 'person_search_term',
                  "operator": 'and',
                  "boost": '3'
                }
              }
            },
            {
              "match": {
                "first_name": {
                  "query": 'person_search_term',
                  "boost": '7'
                }
              }
            },
            {
              "match": {
                "last_name": {
                  "query": 'person_search_term',
                  "boost": '7'
                }
              }
            },
            {
              "match": {
                "first_name.phonetic": {
                  "query": 'person_search_term',
                  "boost": '2'
                }
              }
            },
            {
              "match": {
                "last_name.phonetic": {
                  "query": 'person_search_term',
                  "boost": '2'
                }
              }
            },
            {
              "match": {
                "date_of_birth_as_text": {
                  "query": 'person_search_term',
                  "boost": '7'
                }
              }
            },
            {
              "match": {
                "ssn": {
                  "query": 'person_search_term',
                  "boost": '7'
                }
              }
            },
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
      "_source": _source,
      "highlight": highlight
    }
  end

  let(:_source) do
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
      'race_ethnicity',
      'open_case_responsible_agency_code'
    ]
  end
  let(:highlight) do
    {
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
  end
end
