Rails.application.routes.draw do
  devise_for :users, skip: [:registrations, :sessions]

  namespace :api do
    namespace :v1 do
      devise_scope :user do
        post 'login', to: 'auth/sessions#create', as: :user_session
        delete 'logout', to: 'auth/sessions#destroy', as: :destroy_user_session
      end

      resources :medicines do
        collection do
          get 'search'
        end
      end

      resources :categories

      resources :suppliers do
        collection do
          get 'search'
        end
      end

      resources :invoices, except: [:update, :destroy] do 
        collection do
          get 'search'
          get 'filter'
        end

        get 'generate_pdf', on: :member
      end

      resources :transfers, except: [:destroy] do
        collection do
          get 'search'
          get 'filter'
        end
      end
    end
  end
end
