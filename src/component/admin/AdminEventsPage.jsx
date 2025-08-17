"use client"

import { useState, useEffect } from "react"
import Pagination from "../utils/Pagination"
import { config } from "../../conf/config"
import { FaEdit, FaPhoneAlt, FaTrashAlt } from "react-icons/fa" // Importing React Icons
import { IoMdMail } from "react-icons/io";
import { RiGlobalFill } from "react-icons/ri";

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
            const finalUrl = `${config.apiBaseUrl}/event?${params.toString()}`
            console.log(finalUrl)
            const res = await fetch(finalUrl, {
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
        setPagination((prev)=>({...prev,page:1}))
    }

    const handleUpdateChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventToUpdate((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
        }));
    };

    return (
        <div className="min-h-screen">
            {/* Filters */}
            <div className="bg-white rounded-2xl mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                <input
                    type="text"
                    name="title"
                    placeholder="Filter by Title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-4 py-1 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                />
                <input
                    type="text"
                    name="organizer_name"
                    placeholder="Organizer"
                    value={filters.organizer_name}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-4 py-1 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                />
                <select
                    name="is_approved"
                    value={filters.is_approved}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-4 py-1 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white pr-8 transition duration-200 ease-in-out"
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
                    className="border border-gray-300 rounded-lg px-4 py-1 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                />
                <input
                    type="date"
                    name="end_date"
                    value={filters.end_date}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-4 py-1 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
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

            {/* Events in Card Layout */}
            {!loading && events.length > 0 && (
                <div className="space-y-6">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-gray-50 shadow-lg rounded-2xl p-2 px-4 border border-gray-100 hover:shadow-xl transition duration-300 ease-in-out"
                        >
                            <div className="flex gap-4 flex-wrap">
                                <div className="max-w-70 rounded">
                                    <img className="w-full rounded-xl" src={event.featured_image || 'https://images.unsplash.com/photo-1753001662072-8ad5f40f34fc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} alt={event.title} />
                                     
                                </div>
                                <div className="flex-1  ">
                                    {/* Title + Status */}
                                    <div className="flex  flex-1 md:flex-row   md:justify-between mb-0">
                                        <h3 className="text-2xl font-bold text-gray-800">{event.title}</h3>
                                        <div>
                                            <span
                                                className={`px-4 py-1 mt-2 md:mt-0 inline-flex text-sm font-semibold rounded-full ${event.is_approved
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {event.is_approved ? "Approved" : "Not Approved"}
                                            </span></div>
                                    </div>
                                    {/* Description */}
                                    {event.description && (
                                        <div className="mt-0">
                                            <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                                        </div>
                                    )}
                                    <div className="font-bold text-[18px]">
                                        <span className="text-green-600">from</span>
                                        {" "}
                                        {event.start_time
                                            ? new Date(event.start_time).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            }) +
                                            " " +
                                            new Date(event.start_time).toLocaleTimeString("en-GB", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true
                                            })
                                            : "N/A"}{" "}
                                        <span className="text-green-600">to</span>{" "}
                                        {event.end_time
                                            ? new Date(event.end_time).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            }) +
                                            " " +
                                            new Date(event.end_time).toLocaleTimeString("en-GB", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true
                                            })
                                            : "N/A"}
                                    </div>

                                    <div > <span className="font-semibold"> Organizer:</span>{event.organizer_name}</div>
                                    <div > <span className="font-semibold"> Location:</span>{event.location}</div>
                                    <div className="flex flex-wrap items-center gap-6 text-gray-700 text-sm">
                                        <span className="flex items-center gap-2">
                                            <FaPhoneAlt className="text-indigo-600" />
                                            {event.contact_phone || "N/A"}
                                        </span>

                                        <span className="flex items-center gap-2">
                                            <IoMdMail className="text-indigo-600" />
                                            {event.contact_email || "N/A"}
                                        </span>

                                        <span className="flex items-center gap-2">
                                            <RiGlobalFill className="text-indigo-600" />
                                            {event.website_url || "N/A"}
                                        </span>
                                    </div>

                                </div>
                            </div>






                            {/* Actions */}
                            <div className="mt-2 flex  justify-between">
                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2  mt-0 text-sm text-gray-700">

                                    <p><span className="font-semibold">Registration:</span> {event.registration_link || "N/A"}</p>
                                    <p className="md:col-span-2"><span className="font-semibold">External Links:</span> {event.external_links || "N/A"}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEventToUpdate(event)
                                            setShowUpdateModal(true)
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 cursor-pointer focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEventToDelete(event)
                                            setShowDeleteModal(true)
                                        }}
                                        className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-red-600 text-white  hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ease-in-out transform hover:scale-105"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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


