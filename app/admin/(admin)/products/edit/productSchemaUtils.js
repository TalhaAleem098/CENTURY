import React, { useRef } from 'react';

export function getProductFields(product) {
  // Base product fields
  const baseFields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'brand', label: 'Brand', type: 'text' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'stock', label: 'Stock', type: 'number' },
    { name: 'isFeatured', label: 'Featured', type: 'checkbox' },
    { name: 'color', label: 'Color', type: 'text' },
    { name: 'material', label: 'Material', type: 'text' },
    { name: 'gender', label: 'Gender', type: 'select', options: ['Men', 'Women', 'Unisex'] },
  ];

  // TShirt-specific fields
  if (product?.category === 'TShirt') {
    return [
      ...baseFields,
      { name: 'sizes', label: 'Sizes (comma separated)', type: 'sizes-dimensions' },
    ];
  }
  return baseFields;
}

export function getInitialForm(product) {
  // Only include editable fields
  return {
    name: product?.name || '',
    brand: product?.brand || '',
    price: product?.price || '',
    description: product?.description || '',
    stock: product?.stock || '',
    isFeatured: product?.isFeatured || false,
    color: product?.color || '',
    material: product?.material || '',
    gender: product?.gender || '',
    sizes: product?.sizes || [],
    dimensions: product?.dimensions || {},
    images: product?.images || [],
  };
}

// Custom SizesInput component for comma-separated entry
export function SizesInput({ value, onChange, onDimensionsChange, dimensions }) {
  const inputRef = useRef();
  const [inputValue, setInputValue] = React.useState('');
  // Refs for dimension inputs
  const dimensionRefs = React.useRef({});

  React.useEffect(() => {
    setInputValue('');
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === ',') {
      e.preventDefault();
      const val = inputValue.replace(/,$/, '').trim();
      if (val && !value.includes(val)) {
        onChange([...value, val]);
      }
      setInputValue('');
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value.replace(/\s+/g, ''));
  };

  const handleBlur = () => {
    if (inputValue) {
      const val = inputValue.replace(/,$/, '').trim();
      if (val && !value.includes(val)) {
        onChange([...value, val]);
      }
      setInputValue('');
    }
  };

  const handleRemove = (size) => {
    const newSizes = value.filter((s) => s !== size);
    onChange(newSizes);
  };

  // Keyboard navigation for dimension inputs
  const handleDimensionKeyDown = (e, sizeIdx, size, field) => {
    if (e.key === 'ArrowRight') {
      if (field === 'height') {
        // Move to width of same size
        const widthRef = dimensionRefs.current[`${size}-width`];
        if (widthRef) widthRef.focus();
      } else if (field === 'width') {
        // Move to height of next size
        if (value[sizeIdx + 1]) {
          const nextHeightRef = dimensionRefs.current[`${value[sizeIdx + 1]}-height`];
          if (nextHeightRef) nextHeightRef.focus();
        }
      }
    }
    // Optionally: handle ArrowLeft for reverse navigation
    if (e.key === 'ArrowLeft') {
      if (field === 'width') {
        // Move to height of same size
        const heightRef = dimensionRefs.current[`${size}-height`];
        if (heightRef) heightRef.focus();
      } else if (field === 'height') {
        // Move to width of previous size
        if (value[sizeIdx - 1]) {
          const prevWidthRef = dimensionRefs.current[`${value[sizeIdx - 1]}-width`];
          if (prevWidthRef) prevWidthRef.focus();
        }
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-200 rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="mb-4">
        <label className="block font-bold text-gray-800 mb-2 text-lg">Current Sizes</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {value.length === 0 && <span className="text-gray-400 italic">No sizes added yet.</span>}
          {value.map((size) => (
            <div key={size} className="flex items-center bg-black text-white rounded-full px-3 py-1 text-sm font-semibold shadow">
              {size}
              <button type="button" className="ml-2 text-red-300 hover:text-red-500 transition-colors" onClick={() => handleRemove(size)}>&times;</button>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <label className="block font-bold text-gray-800 mb-1">Add Size</label>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a size (e.g. S, M, L) and press comma to add."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="border border-gray-400 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900 text-base shadow-sm"
          />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-600 bg-gray-100 rounded-lg px-3 py-2 mt-1">
            <span className="font-semibold text-black">Instructions:</span> Enter a size, then press <span className="font-semibold">comma (,)</span> to add. Remove a size by clicking <span className="font-semibold">×</span>. After adding, set the dimensions for each size below.
          </p>
        </div>
      </div>
     <div className="grid grid-cols-1">
  {value.map((size, idx) => (
    <div
      key={size}
      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-lg px-4"
    >
      <span className="font-semibold sm:w-16 min-w-[3.5rem] text-gray-700 text-base text-center">
        {size.toUpperCase()}
      </span>

      <div className="flex sm:items-center gap-2 w-full">
        <input
          type="number"
          placeholder="Height"
          value={dimensions?.[size]?.height || ''}
          onChange={e => onDimensionsChange(size, 'height', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-black text-base"
          ref={el => (dimensionRefs.current[`${size}-height`] = el)}
          onKeyDown={e => handleDimensionKeyDown(e, idx, size, 'height')}
        />
        <span className="text-gray-500">x</span>
        <input
          type="number"
          placeholder="Width"
          value={dimensions?.[size]?.width || ''}
          onChange={e => onDimensionsChange(size, 'width', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-black text-base"
          ref={el => (dimensionRefs.current[`${size}-width`] = el)}
          onKeyDown={e => handleDimensionKeyDown(e, idx, size, 'width')}
        />
      </div>
    </div>
  ))}
</div>

    </div>
  );
}
