import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { getErrorMessage } from '../../utils/helpers';
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from '../../utils/constants';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category) {
      toast.error('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await ticketService.createTicket({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
      });

      toast.success('Ticket submitted successfully! An engineer will be assigned.');
      const newTicketId = response.data?._id;
      if (newTicketId) {
        navigate(`/user/tickets/${newTicketId}`);
      } else {
        navigate('/user/tickets');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/user/tickets"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Back to my tickets"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Support Ticket
          </h1>
          <p className="text-sm text-slate-500">
            Submit a request to our engineering and support operations team.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors duration-150">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Ticket Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Inability to generate monthly invoices in billing module"
            helperText="Provide a clear, descriptive summary of the problem."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={TICKET_CATEGORIES}
              placeholder="Choose a category"
              helperText="Select the functional area affected."
            />

            <Select
              label="Priority"
              required
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={Object.values(TICKET_PRIORITIES)}
              helperText="Assess the urgency of this issue."
            />
          </div>

          <div>
            <label
              htmlFor="ticketDescription"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="ticketDescription"
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Include specific steps to reproduce the issue, unexpected behavior observed, error messages, or affected accounts..."
              className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-150"
            />
            <p className="mt-1 text-xs text-slate-400">
              Clear reproduction steps significantly reduce technical investigation time.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link to="/user/tickets">
              <Button variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" loading={loading} icon={Send}>
              Submit Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
