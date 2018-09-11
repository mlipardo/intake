# frozen_string_literal: true

# Participants Controller handles all service request for
# the creation and modification of screening participant objects.
module Api
  module V1
    class PeopleController < ApiController # :nodoc:
      respond_to :json

      def search
        search_response = PersonSearchRepository.search(
          security_token: session[:security_token],
          search_term: params[:search_term],
          search_after: params[:search_after],
          search_address: params[:search_address],
          is_client_only: params[:is_client_only] == 'true'
        )
        render json: search_response
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
