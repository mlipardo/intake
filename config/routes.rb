# frozen_string_literal: true

require File.join(File.dirname(__FILE__), 'routes/active_screenings_constraint')

Rails.application.routes.draw do
  root 'home#index'

  resources :screenings,
    only: %i[edit show],
    to: 'home#index'

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      get '/security/check_permission' => 'security#check_permission'
      get '/user_info' => 'user#user_info'

      resources :screenings,
        only: %i[new index update show create],
        constraints: Routes::ActiveScreeningsConstraint do
        member do
          get 'history_of_involvements'
          post 'submit'
          post 'contact'
        end
        resources :participants, only: %i[destroy]
      end

      resources :participants, only: %i[create]
      resources :participants,
        only: %i[update],
        constraints: Routes::ActiveScreeningsConstraint

      resources :relationships, only: %i[create index show update]
      get :history_of_involvements, to: 'history_of_involvements#by_client_ids'

      resources :people, only: %i[index show]
      resources :system_codes,
        only: [:index]
      get 'cross_report_agency/:county_id', to: 'system_codes#cross_report_agency'
    end
  end

  resources :version, only: :index
  get '/logout' => 'home#logout'
  get '/snapshot' => 'home#index'

  get '*path', to: 'home#index', constraints: ->(request) { request.format.html? }
end
