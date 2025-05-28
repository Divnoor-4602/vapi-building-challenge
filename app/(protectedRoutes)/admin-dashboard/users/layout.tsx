import React from 'react'


const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col gap-4 p-4'>
      {children}
    </div>
  )
}

export default layout