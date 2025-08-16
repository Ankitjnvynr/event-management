"use client"

import { useState, useEffect } from "react"
import Pagination from "../utils/Pagination"
import { config } from "../../conf/config"
import { FaEdit, FaTrashAlt } from "react-icons/fa" // Importing React Icons

export default function AdminEventsPage() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({
        title: "",
        organizer_name: "",
        is_approved: "",
        start_date: "",
        end_date: "",
    })
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
    })

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [eventToDelete, setEventToDelete] = useState(null)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [eventToUpdate, setEventToUpdate] = useState(null)

    // Fetch events
    useEffect(() => {
        fetchEvents()
    }, [pagination.page, pagination.limit, filters])

    const fetchEvents = async () => {
        try {
            setLoading(true)
            setError(null)

            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...filters,
            })

            const res = await fetch(`${config.apiBaseUrl}/event?${params.toString()}`, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
                method: 'GET'
            })
            const data = await res.json()

            if (!res.ok) throw new Error(data.message || "Failed to fetch events")

            setEvents(data.data.events)
            setPagination({
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total,
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Handle Delete
    const handleDelete = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${config.apiBaseUrl}/event?id=${eventToDelete.id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
            })
            if (!res.ok) throw new Error("Failed to delete event")
            setShowDeleteModal(false)
            fetchEvents()
        } catch (err) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Handle Update
    const handleUpdate = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${config.apiBaseUrl}/event?id=${eventToUpdate.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(eventToUpdate),
            })
            if (!res.ok) throw new Error("Failed to update event")
            setShowUpdateModal(false)
            fetchEvents()
        } catch (err) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters((prev) => ({ ...prev, [name]: value }))
    }

    const handleUpdateChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventToUpdate((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
        }));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center" onClick={fetchEvents}>
                Admin Events Management
            </h1>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                <input
                    type="text"
                    name="title"
                    placeholder="Filter by Title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                />
                <input
                    type="text"
                    name="organizer_name"
                    placeholder="Organizer"
                    value={filters.organizer_name}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                />
                <select
                    name="is_approved"
                    value={filters.is_approved}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white pr-8 transition duration-200 ease-in-out"
                >
                    <option value="">All Statuses</option>
                    <option value="true">Approved</option>
                    <option value="false">Not Approved</option>
                </select>
                <input
                    type="date"
                    name="start_date"
                    value={filters.start_date}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                />
                <input
                    type="date"
                    name="end_date"
                    value={filters.end_date}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                />
            </div>

            {/* Loading, Error, No Events */}
            {loading && <p className="text-center py-10 text-gray-600 text-lg">Loading events... ⏳</p>}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative text-center mx-auto max-w-2xl">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {!loading && events.length === 0 && (
                <p className="text-center py-10 text-gray-600 text-lg">No events found based on your filters. 🧐</p>
            )}

            {/* Events Table */}
            {!loading && events.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Organizer</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.organizer_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(event.start_time).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {event.is_approved ? (
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                No
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setEventToUpdate(event)
                                                setShowUpdateModal(true)
                                            }}
                                            className="text-indigo-600 hover:text-indigo-900 mx-2 transition duration-150 ease-in-out transform hover:scale-110"
                                            title="Edit Event"
                                        >
                                            <FaEdit size={20} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEventToDelete(event)
                                                setShowDeleteModal(true)
                                            }}
                                            className="text-red-600 hover:text-red-900 mx-2 transition duration-150 ease-in-out transform hover:scale-110"
                                            title="Delete Event"
                                        >
                                            <FaTrashAlt size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!loading && events.length > 0 && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        currentPage={pagination.page}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.limit}
                        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                        basePath="/admin/events"
                    />
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full animate-fade-in-down">
                        <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">Confirm Deletion</h2>
                        <p className="text-gray-700 mb-6 text-center">
                            Are you sure you want to delete the event:{" "}
                            <span className="font-extrabold text-indigo-600">{eventToDelete?.title}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ease-in-out"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {showUpdateModal && eventToUpdate && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-down">
                        <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">Update Event: {eventToUpdate.title}</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={eventToUpdate.title || ""}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="organizer_name" className="block text-sm font-medium text-gray-700 mb-1">Organizer Name</label>
                                    <input
                                        type="text"
                                        id="organizer_name"
                                        name="organizer_name"
                                        value={eventToUpdate.organizer_name || ""}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        id="start_time"
                                        name="start_time"
                                        value={eventToUpdate.start_time ? new Date(eventToUpdate.start_time).toISOString().slice(0, 16) : ""}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="datetime-local"
                                        id="end_time"
                                        name="end_time"
                                        value={eventToUpdate.end_time ? new Date(eventToUpdate.end_time).toISOString().slice(0, 16) : ""}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={eventToUpdate.description || ""}
                                        onChange={handleUpdateChange}
                                        rows="3"
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={eventToUpdate.location || ""}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                                    <input
                                        type="text"
                                        id="featured_image"
                                        name="featured_image"
                                        value={eventToUpdate.featured_image || ""}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                    <input
                                        type="text"
                                        id="color"
                                        name="color"
                                        value={eventToUpdate.color || ""}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                                    <input
                                        type="text"
                                        id="contact_phone"
                                        name="contact_phone"
                                        value={eventToUpdate.contact_phone || ""}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                    <input
                                        type="email"
                                        id="contact_email"
                                        name="contact_email"
                                        value={eventToUpdate.contact_email || ""}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                    <input
                                        type="url"
                                        id="website_url"
                                        name="website_url"
                                        value={eventToUpdate.website_url || ""}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="registration_link" className="block text-sm font-medium text-gray-700 mb-1">Registration Link</label>
                                    <input
                                        type="url"
                                        id="registration_link"
                                        name="registration_link"
                                        value={eventToUpdate.registration_link || ""}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="external_links" className="block text-sm font-medium text-gray-700 mb-1">External Links</label>
                                    <input
                                        type="text"
                                        id="external_links"
                                        name="external_links"
                                        value={eventToUpdate.external_links || ""}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex items-center mt-4 md:col-span-2">
                                    <input
                                        type="checkbox"
                                        id="is_all_day"
                                        name="is_all_day"
                                        checked={eventToUpdate.is_all_day === 1}
                                        onChange={handleUpdateChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_all_day" className="ml-2 block text-sm font-medium text-gray-700">All Day Event</label>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="is_approved" className="block text-sm font-medium text-gray-700 mb-1">Approved Status</label>
                                    <select
                                        id="is_approved"
                                        name="is_approved"
                                        value={eventToUpdate.is_approved ? "true" : "false"}
                                        onChange={handleUpdateChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-8"
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Not Approved</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateModal(false)}
                                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}