# frozen_string_literal: true

# PeopleSearchQueryBuilder is a service class responsible for creation
# of an elastic search person search query
class PersonSearchQueryBuilder < QueryBuilder
  ATTRIBUTES = {
    'first_name' => HIGH_BOOST,
    'last_name' => HIGH_BOOST,
    'first_name.phonetic' => LOW_BOOST,
    'last_name.phonetic' => LOW_BOOST,
    'date_of_birth_as_text' => HIGH_BOOST,
    'ssn' => HIGH_BOOST
  }
end
