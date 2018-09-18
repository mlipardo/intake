# frozen_string_literal: true

module WebmockHelpers
  def stub_screening_put_request_with_anything_and_return(
    screening,
    with_updated_attributes: {}
  )
    api_response = screening.merge(with_updated_attributes)
    stub_request(:put, ferb_api_url(FerbRoutes.intake_screening_path(screening[:id])))
      .and_return(json_body(api_response.to_json))
  end

  def stub_person_find(id:, person_response:)
    request_path = dora_api_url(ExternalRoutes.dora_people_light_index_path)
    request_payload = {
      'body' => {
        'query' => {
          'bool' => {
            'must' => [{ 'match' => { 'id' => id } }]
          }
        },
        '_source' => anything
      }
    }
    response_payload = json_body(person_response.to_json, status: 200)
    stub_request(:post, request_path).with(request_payload).to_return(response_payload)
  end

  def stub_person_search(person_response:)
    response_payload = json_body(person_response.to_json, status: 200)
    stub_request(:post, dora_api_url(ExternalRoutes.dora_people_light_index_path))
      .to_return(response_payload)
  end

  def as_json_without_root_id(model)
    model.as_json.except('id')
  end

  def json_body(json, options = {})
    { body: json, headers: { 'Content-Type' => 'application/json' } }.merge(options)
  end

  def ferb_api_url(path)
    "#{Rails.application.config.intake[:ferb_api_url]}#{path}"
  end

  def dora_api_url(path)
    "#{Rails.application.config.intake[:dora_api_url]}#{path}"
  end
end

RSpec.configure do |config|
  config.include WebmockHelpers
end
