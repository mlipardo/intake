# frozen_string_literal: true

# Screening Controller handles all service request for
# the creation and modification of screening objects.
module Api
  module V1
    class ScreeningsController < ApiController # :nodoc:
      def new
        render json: new_screening
      end

      def create
        has_params = params['screening'].blank?
        screening = has_params ? new_screening : params.require(:screening).as_json.symbolize_keys
        render json: ScreeningRepository.create(session[:security_token], screening)
      end

      def update
        screening = params.require(:screening).as_json.symbolize_keys
        updated_screening = ScreeningRepository.update(session[:security_token], screening)
        render json: updated_screening
      end

      def show
        screening = ScreeningRepository.find(session[:security_token], params[:id])
        render json: screening
      end

      def index
        render json: ScreeningRepository.search(session[:security_token])
      end

      def history_of_involvements
        involvements = ScreeningRepository.history_of_involvements(
          session[:security_token], params[:id]
        )
        render json: involvements
      end

      def submit
        render json: ScreeningRepository.submit(session[:security_token], params[:id])
      end

      def contact
        contact = params.require(:contact).as_json.symbolize_keys
        render json: ScreeningRepository.contact(session[:security_token], params[:id], contact)
      end

      private

      def build_incident_county(session)
        user_details = session[:user_details]
        return nil unless user_details

        user_details.county_code
      end

      def build_staff_id(session)
        user_details = session[:user_details]
        return nil unless user_details

        user_details.staff_id
      end

      def build_assignee_name(session)
        user_details = session[:user_details]
        return nil unless user_details

        assignee_details = [
          user_details.try(:first_name),
          ("#{user_details.middle_initial}." unless user_details.middle_initial.blank?),
          user_details.try(:last_name),
          ("- #{user_details.county}" if user_details.county)
        ]
        assignee_details.join(' ').gsub(/\s+/, ' ').strip
      end

      def current_time
        Time.now.change(usec: 0, sec: 0).utc
      end

      def new_screening
        {
          reference: LUID.generate.first,
          assignee: build_assignee_name(session),
          assignee_staff_id: build_staff_id(session),
          incident_county: build_incident_county(session),
          indexable: true,
          started_at: current_time
        }.merge(empty_screening_fields)
      end

      def empty_screening_fields
        { addresses: [], cross_reports: [], participants: [],
          allegations: [], incident_address: {} }
      end
    end
  end
end
