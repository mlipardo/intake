# frozen_string_literal: true

# Participants Controller handles all service request for
# the creation and modification of screening participant objects.
module Api
  module V1
    class PeopleController < ApiController # :nodoc:
      def index
        # search = Search.new(security_token: session[:security_token], params)
        # response = search.fetch
        # render json: response
      end

      def show
        ParticipantRepository.authorize(session[:security_token], params[:id])

        search_response = PersonSearchRepository.find(
          security_token: session[:security_token],
          id: params[:id]
        )
        render json: search_response.to_json, status: 200
      rescue ParticipantRepository::AuthorizationError
        render json: { status: 403 }, status: 403
      end
    end
  end
end
