Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'admin/sessions' }, skip: [:registrations]

  devise_scope :user do
    delete 'users/sign_out', to: 'admin/sessions#destroy', as: :destroy_admin_session
  end

  devise_for :users, skip: [:registrations, :sessions]

  ActiveAdmin.routes(self)

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

      resources :students, only: [:index, :show] do
        resources :prescriptions, only: [:index, :show, :update] do
          get 'generate_pdf', on: :member
        end

        collection do
          get 'search'
        end
      end

      resources :orders, only: [:index, :show, :create] do
        collection do
          get 'search'
        end

        get 'generate_pdf', on: :member
      end

      resources :salaf_requests, only: [:index, :show, :create, :update] do
        collection do
          get 'search'
        end
      end
    end
  end
end
