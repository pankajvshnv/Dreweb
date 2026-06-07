import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { getLocalData, deleteDocument } from '../../lib/crud';

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await getLocalData('templates');
      setTemplates(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await deleteDocument('templates', id);
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  if (loading) return <div className="p-8">Loading templates...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Templates Shop</h1>
          <p className="text-zinc-500 mt-1">Manage templates available for purchase.</p>
        </div>
        <Link 
          to="/admin/templates/new" 
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-zinc-800 transition-colors font-medium"
        >
          <Plus size={20} />
          Add Template
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50">
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Template</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Price</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500">
                    No templates found. Add one to get started.
                  </td>
                </tr>
              ) : (
                templates.map((template) => (
                  <tr key={template.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {template.heroImage ? (
                          <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                            <img src={template.heroImage} alt={template.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                            <span className="text-zinc-400 text-xs font-medium">No Img</span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-zinc-900 group-hover:text-brand-lime transition-colors">{template.title}</p>
                          <p className="text-xs text-zinc-500">{template.category || 'No Category'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{template.price}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                        template.isPublic !== false ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {template.isPublic !== false ? 'Public' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/checkout?template=${template.id}`}
                          target="_blank"
                          className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Checkout"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link 
                          to={`/admin/templates/${template.id}`}
                          className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(template.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
