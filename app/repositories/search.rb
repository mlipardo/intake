# frozen_string_literal: true

# class for making dora api call
class Search
  attr_reader :security_token, :params

  def initialize(security_token: nil, **params)
    @security_token = security_token
    @params = params
  end

  def fetch
    response = DoraAPI.make_api_call(
      security_token,
      ExternalRoutes.dora_people_light_index_path,
      :post,
      search_query
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

  def search_query
    QueryBuilder.new(params).query
  end
end
