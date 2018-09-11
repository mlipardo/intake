# frozen_string_literal: true

# PeopleSearchQueryBuilder is a service class responsible for creation
# of an elastic search person search query
class PersonSearchQueryBuilder
  NUMBER_OF_FRAGMENTS = 10
  LOW_BOOST = 2
  MEDIUM_BOOST = 3
  HIGH_BOOST = 7
  NO_BOOST = 1
  attr_reader :search_after

  def initialize(search_term: '', search_after: nil, is_client_only: true)
    @search_term = search_term
    @search_after = search_after
    @is_client_only = is_client_only
  end

  def build
    {
      size: 10,
      track_scores: true,
      sort: [{ _score: 'desc', _uid: 'desc' }],
      query: query,
      _source: fields,
      highlight: highlight
    }.tap do |query|
      query[:search_after] = search_after if search_after
    end
  end

  private

  def formatted_search_term
    @search_term
      .downcase
      .gsub(%r{[-/]*(\d+)[-/]*}, '\1')
  end

  def query
    { bool: { must: must, should: should } }
  end

  def base_query
    { bool: { should: [
      fuzzy_query,
      and_query(:'autocomplete_search_bar.diminutive', formatted_search_term, NO_BOOST),
      and_query(:'autocomplete_search_bar.phonetic', formatted_search_term, NO_BOOST)
    ] } }
  end

  def and_query(field, term, boost)
    { match: { field => { query: term, operator: 'and', boost: boost } } }
  end

  def must
    # the client_only_search config option overrides the @is_client_only value
    return [base_query] unless Rails.configuration.intake[:client_only_search] || @is_client_only
    [base_query, client_only]
  end

  def match_query(field, term, boost)
    { match: { field => { query: term, boost: boost } } }
  end

  def should
    term = formatted_search_term
    [
      and_query(:autocomplete_search_bar, term, MEDIUM_BOOST),
      match_query(:first_name, term, HIGH_BOOST),
      match_query(:last_name, term, HIGH_BOOST),
      match_query(:'first_name.phonetic', term, LOW_BOOST),
      match_query(:'last_name.phonetic', term, LOW_BOOST),
      match_query(:date_of_birth_as_text, term, HIGH_BOOST),
      match_query(:ssn, term, HIGH_BOOST)
    ] + PersonSearchByAddress.new.search_by_address(term)
  end

  def fuzzy_query
    {
      match: {
        autocomplete_search_bar: {
          query: formatted_search_term,
          operator: 'and',
          boost: LOW_BOOST
        }
      }
    }
  end

  def client_only
    { match: { 'legacy_descriptor.legacy_table_name': 'CLIENT_T' } }
  end

  def fields
    %w[id legacy_source_table first_name middle_name last_name name_suffix gender
       date_of_birth date_of_death ssn languages races ethnicity client_counties
       addresses.id addresses.effective_start_date addresses.street_name addresses.street_number
       addresses.city addresses.state_code addresses.zip addresses.type addresses.legacy_descriptor
       addresses.phone_numbers.number addresses.phone_numbers.type legacy_descriptor highlight
       phone_numbers.id phone_numbers.number phone_numbers.type sensitivity_indicator race_ethnicity
       open_case_responsible_agency_code]
  end

  def auto_bar_highlight
    { 'matched_fields':
      ['autocomplete_search_bar',
       'autocomplete_search_bar.phonetic',
       'autocomplete_search_bar.diminutive'] }
  end

  def highlight
    { order: 'score',
      number_of_fragments: NUMBER_OF_FRAGMENTS,
      require_field_match: false,
      fields: {
        'autocomplete_search_bar': auto_bar_highlight,
        'searchable_date_of_birth': {}
      } }
  end
end
