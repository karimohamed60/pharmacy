Rails.application.routes.draw do
  devise_for :users, skip: [:registrations, :sessions]

  namespace :api do
    namespace :v1 do
      devise_scope :user do
        post 'login', to: 'auth/sessions#create', as: :user_session
        delete 'logout', to: 'auth/sessions#destroy', as: :destroy_user_session
      end
    end
  end
end
