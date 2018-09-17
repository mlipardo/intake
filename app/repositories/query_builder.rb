# frozen_string_literal: true

# parent class for dora search
class QueryBuilder
  NUMBER_OF_FRAGMENTS = '10'
  LOW_BOOST = '2'
  MEDIUM_BOOST = '3'
  HIGH_BOOST = '7'
  NO_BOOST = '1'
  SIZE = '10'
  TRACK_SCORES = 'true'
  REQUIRE_FIELD_MATCH = 'false'

  attr_accessor :search_term, :search_address, :search_after, :is_client_only

  def initialize(params = {})
    params = params.with_indifferent_access
    @search_term    = params[:search_term]
    @search_after   = params[:search_after]
    @search_address = params[:search_address]
    @is_client_only = params.fetch(:is_client_only, 'true') == 'true'
  end

  def build_query
    person_build = PersonSearchQueryBuilder.new(search_term: @search_term).build
    return person_build if @search_address.blank?
    address_query = PersonSearchByAddress.new(search_address: @search_address).query
    join_person_and_address(person_build[:query], address_query)
    person_build
  end

  def join_person_and_address(person_query, address_query)
    person_query[:bool][:must].concat(address_query[:bool][:must])
    person_query[:bool][:should].concat(address_query[:bool][:should])
  end

  def build
    { size: SIZE, track_scores: TRACK_SCORES, sort: [{ _score: 'desc', _uid: 'desc' }],
      query: query, _source: fields, highlight: highlight }.tap do |query|
      query[:search_after] = @search_after if @search_after
    end
  end

  def formatted_query
    @search_term.downcase.gsub(%r{[-/]*(\d+)[-/]*}, '\1')
  end

  def must
    # the client_only_search config option overrides the @is_client_only value
    return [base_query] unless Rails.configuration.intake[:client_only_search] ||
                               @is_client_only
    [base_query, client_only]
  end

  def query
    { bool: { must: must, should: should } }
  end

  def base_query
    { bool: { should: [
      match_query('autocomplete_search_bar', formatted_query,
        operator: 'and', boost: LOW_BOOST),
      match_query('autocomplete_search_bar.diminutive', formatted_query,
        operator: 'and', boost: NO_BOOST),
      match_query('autocomplete_search_bar.phonetic', formatted_query,
        operator: 'and', boost: NO_BOOST)
    ].compact } }
  end

  def match_query(field, query, operator: nil, boost: nil)
    return if query.blank?
    { match: {
      field.to_sym => {
        query: query, operator: operator, boost: boost
      }.delete_if { |_k, v| v.blank? }
    } }
  end

  def should
    [match_query('autocomplete_search_bar', formatted_query,
      operator: 'and', boost: MEDIUM_BOOST),
     build_match_query].flatten
  end

  def build_match_query
    self.class::ATTRIBUTES.map { |k, v| match_query(k, formatted_query, boost: v) }
  end

  def fields
    %w[id legacy_source_table first_name middle_name last_name name_suffix gender
       date_of_birth date_of_death ssn languages races ethnicity client_counties
       addresses.id addresses.effective_start_date addresses.street_name addresses.street_number
       addresses.city addresses.county addresses.state_code addresses.zip addresses.type
       addresses.legacy_descriptor addresses.phone_numbers.number addresses.phone_numbers.type
       legacy_descriptor highlight phone_numbers.id phone_numbers.number
       phone_numbers.type sensitivity_indicator race_ethnicity open_case_responsible_agency_code]
  end

  def client_only
    { match: { 'legacy_descriptor.legacy_table_name': 'CLIENT_T' } }
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
      require_field_match: REQUIRE_FIELD_MATCH,
      fields: {
        'autocomplete_search_bar': auto_bar_highlight,
        'searchable_date_of_birth': {}
      } }
  end
end
