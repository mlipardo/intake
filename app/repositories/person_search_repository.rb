# frozen_string_literal: true

# PersonSearchRepository is a service class responsible for search of a person
# resource via the API
class PersonSearchRepository
  class << self
    def search(security_token:, search_term:, search_after:)
      response = DoraAPI.make_api_call(
        security_token,
        ExternalRoutes.dora_people_light_index_path,
        :post,
        search_query(search_term: search_term, search_after: search_after)
      )
      body response
    end

    def find(security_token:, id:)
      raise 'id is required' unless id
      response = DoraAPI.make_api_call(
        security_token,
        ExternalRoutes.dora_people_light_index_path,
        :post,
        find_query(id)
      )
      body(response).dig('hits', 'hits', 0, '_source')
    end

    private

    def body(response)
      search_body = response.body
      raise search_body unless response.status == 200
      search_body
    end

    def find_query(id)
      {
        query: {
          bool: {
            must: [{ match: { id: id.to_s } }]
          }
        },
        _source: find_fields
      }
    end

    # These fields are slightly different than the fields search uses. The set
    # was chosen in order to preserve the same data returned by FerbAPI, but
    # in the future find should return the same fields (or a superset) of
    # those returned by search. See person_search_query_builder.rb.
    def find_fields
      %w[ id legacy_source_table first_name middle_name last_name name_suffix gender
          date_of_birth date_of_death ssn languages addresses phone_numbers legacy_descriptor
          sensitivity_indicator race_ethnicity]
    end

    def search_query(search_term:, search_after:)
      PersonSearchQueryBuilder.new(
        search_term: search_term, search_after: search_after
      ).build
    end
  end
end
