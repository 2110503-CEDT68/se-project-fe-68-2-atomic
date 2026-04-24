'use client'

export default function ReviewDentistPanel({
  reviews
}: {
  reviews: ReviewJson
}) {
  
  return (
    <section className="bg-white py-8 lg:py-16 antialiased">
      <div className="max-w-2xl mx-auto px-4">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Add a Comment</h2>
        </div>

        <form className="mb-6">
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
            <label htmlFor="comment" className="sr-only">Your comment</label>
            <textarea id="comment" rows={6}
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
              placeholder="Write a comment..." required></textarea>
          </div>
          <button type="submit"
            className="bg-black inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800">
            Post comment
          </button>
        </form>

        {
          reviews.data.length ?
          reviews.data.map((review: ReviewItem) => (
            <article key={review._id} className="p-6 text-base bg-white rounded-lg">
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">Michael Gough</p>
                  <p className="text-sm text-gray-600">Feb. 8, 2022</p>
                </div>
                <button id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                  className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
                  type="button">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                  </svg>
                  <span className="sr-only">Comment settings</span>
                </button>
                {/* <!-- Dropdown menu --> */}
                <div id="dropdownComment1"
                  className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow">
                  <ul className="py-1 text-sm text-gray-700"
                    aria-labelledby="dropdownMenuIconHorizontalButton">
                    <li>
                      <a href="#"
                        className="block py-2 px-4 hover:bg-gray-100">Edit</a>
                    </li>
                    <li>
                      <a href="#"
                        className="block py-2 px-4 hover:bg-gray-100">Remove</a>
                    </li>
                    <li>
                      <a href="#"
                        className="block py-2 px-4 hover:bg-gray-100">Report</a>
                    </li>
                  </ul>
                </div>
              </footer>
              <p className="text-gray-500">Very straight-to-point article. Really worth time reading. Thank you! But tools are just the
                instruments for the UX designers. The knowledge of the design tools are as important as the
                creation of the design strategy.</p>
            </article>
          )) : null
        }
        
        
      </div>
    </section>
  )
}