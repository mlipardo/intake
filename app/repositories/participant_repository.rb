# frozen_string_literal: true

# ParticipantRepository is a service class responsible for creation of a participant
# resource via the API
class ParticipantRepository
  PARTICIPANTS_PATH = '/api/v1/participants'

  def self.create(participant)
    participant_data = participant.as_json(except: :id)
    response = API.make_api_call(PARTICIPANTS_PATH, :post, participant_data)
    Participant.new(response.body)
  end

  def self.delete(id)
    API.make_api_call("#{PARTICIPANTS_PATH}/#{id}", :delete)
  end
end
