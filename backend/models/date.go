package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"
)

type Date struct {
	time.Time
}

const dateLayout = "2006-01-02"

func (d *Date) UnmarshalJSON(data []byte) error {
	var dateString string
	err := json.Unmarshal(data, &dateString)
	if err != nil {
		return err
	}

	parsedTime, err := time.Parse(dateLayout, dateString)
	if err != nil {
		return err
	}

	d.Time = parsedTime
	return nil
}

// Value method to convert Date to database/sql type
func (d Date) Value() (driver.Value, error) {
	return d.Time.Format(dateLayout), nil
}

// Scan method to convert database/sql type to Date
func (d *Date) Scan(value interface{}) error {
	switch v := value.(type) {
	case time.Time:
		d.Time = v
		return nil
	case []byte:
		parsedTime, err := time.Parse(dateLayout, string(v))
		if err != nil {
			return err
		}
		d.Time = parsedTime
		return nil
	case string:
		parsedTime, err := time.Parse(dateLayout, v)
		if err != nil {
			return err
		}
		d.Time = parsedTime
		return nil
	default:
		return fmt.Errorf("unable to scan %T into Date", value)
	}
}
