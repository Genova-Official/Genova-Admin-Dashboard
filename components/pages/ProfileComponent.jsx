import React from 'react'
import Typography from '../reusables/typography/Typography'

export default function ProfileComponent() {
  return (
    <div className='border'>
    <Typography size="lg" variant="h3" className="text-accent mb-4">
      Profile Information
    </Typography>
    <div className="personalData border border-b-1 grid grid-cols-3">
        <div className="border-r-1 col-span-2">
          <Typography size="md" variant="h4" className="text-gray-600 mb-2">
            Full Name:
          </Typography>
          <Typography size="md" variant="h5" className="text-gray-800">
            John Doe
          </Typography>
        </div>
        <div className="border-r-1 col-span-1">
          <Typography size="md" variant="h4" className="text-gray-600 mb-2">
            Email:
          </Typography>
          <Typography size="md" variant="h5" className="text-gray-800">
            john.doe@example.com
          </Typography>
        </div>
        <div className="col-span-1">
          <Typography size="md" variant="h4" className="text-gray-600 mb " ></Typography>
          </div>
    </div>
    {/* Add profile information content here */}
  </div>  )
}
