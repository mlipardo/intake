# frozen_string_literal: true

# PeopleSearchByAddress is a service class responsible for creation
# of an elastic search person search query
class PersonSearchByAddress < QueryBuilder
  ATTRIBUTES = {
    'addresses.searchable_address' => HIGH_BOOST,
    'addresses.city' => HIGH_BOOST,
    'addresses.county' => LOW_BOOST
  }.freeze

  attr_accessor :city, :county

  def initialize(**params)
    super
    @search_term = params.dig(:search_address, :street).to_s
    @city = params.dig(:search_address, :city).to_s
    @county = params.dig(:search_address, :county).to_s
  end

  def must
    [base_query]
  end

  def base_query
    { nested:
        { path: 'addresses',
          query: { bool: nested_must },
          inner_hits: highlight } }
  end

  def nested_must
    { must:
      [match_query('addresses.autocomplete_searchable_address', @search_term, operator: 'and'),
       match_query('addresses.autocomplete_city', @city),
       match_query('addresses.county.description', @county),
       { match: { "addresses.last_known": { query: 'true' } } }].compact }
  end

  def highlight
    {
      highlight: {
        fields: { "addresses.autocomplete_city": {},
                  "addresses.autocomplete_searchable_address": {},
                  "addresses.county.description": {} }
      }
    }
  end

  def should
    [{ "nested": { "path": 'addresses', "query": { "bool": {
      "should": [
        match_query('addresses.searchable_address', @search_term,
          operator: 'and', boost: MEDIUM_BOOST),
        match_query('addresses.city', @city, boost: MEDIUM_BOOST)
      ].compact
    } } } }]
  end
end
