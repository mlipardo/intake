# frozen_string_literal: true

# PeopleSearchByAddress is a service class responsible for creation
# of an elastic search person search query
class PersonSearchByAddress < PersonSearchQueryBuilder
  def search_by_address(term)
    [
      match_query(:'addresses.street_address', term, HIGH_BOOST),
      match_query(:'addresses.city', term, HIGH_BOOST),
      match_query(:'addresses.county', term, HIGH_BOOST)
    ]
  end
end
