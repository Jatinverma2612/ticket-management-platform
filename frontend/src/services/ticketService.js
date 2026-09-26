import api from './api';

export const ticketService = {
  /**
   * Get role-scoped list of tickets
   */
  async getTickets() {
    const response = await api.get('/tickets');
    return response.data;
  },

  /**
   * Get single ticket by ID (includes populated details & activities)
   */
  async getTicketById(id) {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Create a new ticket (user only)
   */
  async createTicket(ticketData) {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  /**
   * Assign an engineer to a ticket (admin only)
   */
  async assignTicket(id, engineerId) {
    const response = await api.patch(`/tickets/${id}/assign`, { engineerId });
    return response.data;
  },

  /**
   * Update ticket status along allowed lifecycle (admin or assigned engineer)
   */
  async updateStatus(id, status) {
    const response = await api.patch(`/tickets/${id}/status`, { status });
    return response.data;
  },

  /**
   * Update ticket priority (admin only)
   */
  async updatePriority(id, priority) {
    const response = await api.patch(`/tickets/${id}/priority`, { priority });
    return response.data;
  },

  /**
   * Get comments for a ticket
   */
  async getComments(ticketId) {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  /**
   * Add a comment to a ticket
   */
  async addComment(ticketId, message) {
    const response = await api.post(`/tickets/${ticketId}/comments`, { message });
    return response.data;
  },

  /**
   * Get activity timeline for a ticket
   */
  async getActivities(ticketId) {
    const response = await api.get(`/tickets/${ticketId}/activities`);
    return response.data;
  },

  /**
   * Get list of engineers for assignment (admin only)
   */
  async getEngineers() {
    const response = await api.get('/users/engineers');
    return response.data;
  },

  /**
   * Get centralized inbox of incoming user comments (Admin or Engineer)
   */
  async getCommentsInbox() {
    const response = await api.get('/tickets/comments/inbox');
    return response.data;
  },
};
