class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::JTIMatcher

  enum :role, { member: 0, librarian: 1 }, default: :member

  validates :role, presence: true

  def librarian?
    role == 'librarian'
  end

  def member?
    role == 'member'
  end
end
