# frozen_string_literal: true

# Participants Controller handles all service request for
# the creation and modification of screening participant objects.
module Api
  module V1
    class PeopleController < ApiController # :nodoc:
      def index
        response = PersonSearchRepository.search(search_params.to_hash,
          security_token: session[:security_token])
        render json: response
      end

      def show
        ParticipantRepository.authorize(session[:security_token], params[:id])

        search_response = PersonSearchRepository.find(
          params[:id], security_token: session[:security_token]
        )
        render json: search_response.to_json, status: 200
      rescue ParticipantRepository::AuthorizationError
        render json: { status: 403 }, status: 403
      end

      private

      def search_params
        params.permit(:search_term, :is_client_only, :search_after,
          search_address: %i[street city county])
      end
    end
  end
end
