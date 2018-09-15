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

  def build_match_query
    self.class::ATTRIBUTES.map do |key, value|
      match_query(key, value)
    end
  end

  def query
    { bool: { must: must, should: should } }
  end

  def nested_path_query(nested_hash)
    { nested:
        { path: 'addresses',
          query:
            { bool: nested_hash },
          inner_hits: highlight } }
  end

  def nested_must
    { must:
      [{ match:
          { "addresses.autocomplete_searchable_address": {
            query: @search_termb, operator: 'and'
          } } },
       { match: { "addresses.autocomplete_city": { query: @city } } },
       { match: { "addresses.county.description": { query: @county } } },
       { match: { "addresses.last_known": { query: 'true' } } }] }
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
    { nested:
        { path: 'addresses',
          query:
            { bool: build_match_query } } }
  end

  # def nested_should
  #   { should:
  #     [{ match:
  #       { 'addresses.searchable_address':
  #         { query: @search_term,
  #           operator: 'and',
  #           boost: MEDIUM_BOOST } } },
  #      { match: { 'addresses.city':
  #        { query: @city, boost: MEDIUM_BOOST } } }] }
  # end
end
