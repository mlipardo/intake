# frozen_string_literal: true

# PeopleSearchByAddress is a service class responsible for creation
# of an elastic search person search query
class PersonSearchByAddress
  MEDIUM_BOOST = 3
  HIGH_BOOST = 7
  def search_by_address(term)
    [
      match_query(:'address.street_name', term, HIGH_BOOST),
      match_query(:'address.street_number', term, HIGH_BOOST),
      match_query(:'address.city', term, HIGH_BOOST),
      match_query(:'address.county', term, HIGH_BOOST),
      match_query(:'address.state_code', term, HIGH_BOOST),
      match_query(:'address.zip', term, HIGH_BOOST)
    ]
  end

  private

  def and_query(field, term, boost)
    { match: { field => { query: term, operator: 'and', boost: boost } } }
  end

  def match_query(field, term, boost)
    { match: { field => { query: term, boost: boost } } }
  end
end
