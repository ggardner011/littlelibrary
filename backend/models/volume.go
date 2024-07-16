package models

import (
	"time"

	_ "github.com/lib/pq"
	"gorm.io/gorm"
)

type Volume struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CreatedAt   time.Time      `gorm:"not null" json:"created_at"`
	UpdatedAt   time.Time      `gorm:"not null" json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Serial      string         `gorm:"uniqueIndex" json:"serial_number"`
	Status      string         `json:"status"` // "checked_in", "checked_out", "reserved"
	BookID      uint           `gorm:"not null" json:"book_id,omitempty"`
	AddedBy     uint           `json:"added_by,omitempty"`
	CurrentUser uint           `json:"current_user,omitempty"`

	Book  Book `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;foreignKey:BookID" json:"book,omitempty"`
	Admin User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;foreignKey:AddedBy" json:"-"`
	User  User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;foreignKey:CurrentUser" json:"-"`
}

type VolumeTransaction struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	VolumeID    uint      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"volume_id"`
	Status      string    `json:"action"` // "checked_in", "checked_out", "reserve"
	Timestamp   time.Time `json:"timestamp"`
	AddedBy     uint      `json:"added_by,omitempty"`
	CurrentUser uint      `json:"current_user,omitempty"`

	Volume Volume `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;foreignKey:VolumeID" json:"-"`
	Admin  User   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;foreignKey:AddedBy" json:"-"`
	User   User   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;foreignKey:CurrentUser" json:"-"`
}
