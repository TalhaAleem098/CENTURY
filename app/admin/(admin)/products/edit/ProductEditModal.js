import { useEffect, useState } from 'react';
import { getProductFields, getInitialForm, SizesInput } from './productSchemaUtils';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';

const ProductEditModal = ({ product, open, onClose, onSave }) => {
  const [form, setForm] = useState(getInitialForm(product));
  const [initialForm, setInitialForm] = useState(getInitialForm(product));
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (product) {
      const initial = getInitialForm(product);
      setForm(initial);
      setInitialForm(initial);
      setHasChanges(false);
    }
  }, [product, open]);

  // Detect changes
  useEffect(() => {
    setHasChanges(JSON.stringify(form) !== JSON.stringify(initialForm));
  }, [form, initialForm]);

  const fields = getProductFields(product);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'isFeatured') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'sizes') {
      // handled by SizesInput
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSizesChange = (sizesArr) => {
    setForm((prev) => {
      const newDimensions = { ...prev.dimensions };
      sizesArr.forEach((size) => {
        if (!newDimensions[size]) newDimensions[size] = { height: '', width: '' };
      });
      // Remove dimensions for sizes not present
      Object.keys(newDimensions).forEach((size) => {
        if (!sizesArr.includes(size)) delete newDimensions[size];
      });
      return { ...prev, sizes: sizesArr, dimensions: newDimensions };
    });
  };

  const handleDimensionChange = (size, field, value) => {
    setForm((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [size]: {
          ...prev.dimensions[size],
          [field]: value,
        },
      },
    }));
  };

  const handleImageChange = (idx, field, value) => {
    setForm((prev) => {
      const images = [...prev.images];
      images[idx] = { ...images[idx], [field]: value };
      return { ...prev, images };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info('Saving product...');
    setSaving(true);
    try {
      const res = await fetch(`/api/products/edit?id=${product._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, category: product.category }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast(data.error || 'Failed to update product');
        setSaving(false);
        return;
      }
      const data = await res.json();
      toast('Product updated successfully!');
      setSaving(false);
      setHasChanges(false);
      setInitialForm(getInitialForm(data.updated));
      if (onSave) onSave(data.updated);
    } catch (err) {
      toast('Network error while updating product');
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[100vh] overflow-y-auto flex flex-col">
        <button className="absolute top-4 right-4 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <div className="mb-6">
          <label className="block font-semibold mb-1">Images</label>
          <div className="flex flex-row gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
            {form.images.map((img, idx) => (
              <div key={idx} className="flex flex-col items-center border border-gray-200 rounded-lg p-2 bg-gray-50 w-28 h-36 justify-between relative overflow-hidden flex-shrink-0">
                <div className="w-24 h-24 flex items-center justify-center mb-1">
                  <Image src={img.url} alt="Product" width={96} height={96} className="object-cover w-full h-full rounded-md" />
                </div>
                <div className="w-full text-xs text-center break-all px-1 text-gray-600 mb-1">
                  <a href={img.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">{img.url}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-4">
            {fields.find(f => f.name === 'name') && (
              <div key="name">
                <label className="block font-semibold mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {fields.find(f => f.name === 'brand') && (
              <div key="brand">
                <label className="block font-semibold mb-1">Brand</label>
                <input
                  name="brand"
                  type="text"
                  value={form.brand}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            )}
            {fields.find(f => f.name === 'price') && (
              <div key="price">
                <label className="block font-semibold mb-1">Price</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {fields.find(f => f.name === 'stock') && (
              <div key="stock">
                <label className="block font-semibold mb-1">Stock</label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            )}
            {fields.find(f => f.name === 'material') && (
              <div key="material">
                <label className="block font-semibold mb-1">Material</label>
                <input
                  name="material"
                  type="text"
                  value={form.material}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            )}
          </div>
          {/* Color and Gender in same row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.find(f => f.name === 'color') && (
              <div key="color">
                <label className="block font-semibold mb-1">Color</label>
                <input
                  name="color"
                  type="text"
                  value={form.color}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            )}
            {fields.find(f => f.name === 'gender') && (
              <div key="gender">
                <label className="block font-semibold mb-1">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black">
                  <option value="">Select</option>
                  {fields.find(f => f.name === 'gender').options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            )}
          </div>
          {/* Render remaining fields as before, skipping those already rendered and checkbox */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.filter(f => !['name','brand','price','stock','material','color','gender','isFeatured'].includes(f.name)).map((field) => {
              if (field.type === 'textarea') {
                return (
                  <div key={field.name} className="col-span-2">
                    <label className="block font-semibold mb-1">{field.label}</label>
                    <textarea name={field.name} value={form[field.name]} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-black" />
                  </div>
                );
              }
              if (field.type === 'sizes-dimensions') {
                return (
                  <div key={field.name} className="col-span-2">
                    <label className="block font-semibold mb-1">Sizes (comma separated)</label>
                    <SizesInput
                      value={form.sizes}
                      onChange={handleSizesChange}
                      onDimensionsChange={handleDimensionChange}
                      dimensions={form.dimensions}
                    />
                  </div>
                );
              }
              return (
                <div key={field.name}>
                  <label className="block font-semibold mb-1">{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              );
            })}
          </div>
          {/* Checkbox at the end after sizes */}
          {fields.find(f => f.name === 'isFeatured') && (
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
              <label className="font-semibold">{fields.find(f => f.name === 'isFeatured').label}</label>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-outline border border-gray-400 px-4 py-2 rounded-lg" onClick={onClose} disabled={saving}>Cancel</button>
            <button
              type="submit"
              className={`btn btn-primary bg-black text-white px-4 py-2 rounded-lg transition-opacity ${!hasChanges || saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!hasChanges || saving}
              data-tooltip-id="save-tooltip"
              data-tooltip-content={
                saving
                  ? 'Saving...'
                  : !hasChanges
                  ? 'No changes to save'
                  : 'Save changes'
              }
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
