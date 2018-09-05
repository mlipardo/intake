# frozen_string_literal: true

# ScreeningRepository is a service class responsible for creation of a screening
# resource via the API
class ScreeningRepository
  def self.create(security_token, screening)
    response = FerbAPI.make_api_call(
      security_token,
      FerbRoutes.intake_screenings_path,
      :post,
      screening.as_json(except: 'id')
    )
    response.body.to_json
  end

  def self.find(security_token, id)
    response = FerbAPI.make_api_call(
      security_token,
      FerbRoutes.intake_screening_path(id),
      :get
    )
    response.body.as_json
  end

  def self.update(security_token, screening)
    raise 'Error updating screening: id is required' unless screening[:id]
    response = FerbAPI.make_api_call(
      security_token,
      FerbRoutes.intake_screening_path(screening[:id]),
      :put,
      screening
    )
    response.body.as_json
  end

  def self.search(security_token)
    response = FerbAPI.make_api_call(
      security_token,
      FerbRoutes.screenings_path,
      :get
    )
    response.body.to_json
  end

  def self.history_of_involvements(security_token, id)
    api = FerbAPI
    path = FerbRoutes.screening_history_of_involvements_path(id)
    response = api.make_api_call(security_token, path, :get)
    response.body
  end

  def self.submit(security_token, id)
    response = FerbAPI.make_api_call(
      security_token,
      FerbRoutes.screening_submit_path(id),
      :post,
      {}
    )
    response.body.as_json
  end

  def self.contact(security_token, id, contact)
    response = FerbAPI.make_api_call(
      security_token,
      FerbRoutes.contacts_path(id),
      :post,
      contact
    )
    response.body.as_json
  end
end
