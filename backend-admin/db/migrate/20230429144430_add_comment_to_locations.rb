class AddCommentToLocations < ActiveRecord::Migration[7.0]
  def change
    add_column :locations, :comment, :string
  end
end
