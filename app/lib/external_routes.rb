# frozen_string_literal: true

# The external routes will be accessible from here.
class ExternalRoutes
  class << self
    def dora_people_light_index_path
      '/dora/people-summary/person-summary/_search'
    end

    def sdm_path
      'https://ca.sdmdata.org'
    end
  end
end
