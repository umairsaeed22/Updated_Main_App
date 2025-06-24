import React from 'react';
import ReactDom from 'react-dom';
import useDropdownStore from '../../../store/useDropdownStore';
import { useLanguage } from '../../../../../context/LanguageContext';
import { currency } from '../../constants';
import { RiCloseLargeFill } from 'react-icons/ri';
import { AnimatePresence, motion } from 'framer-motion'; // ✅ use 'framer-motion' not 'motion/react'!
import noImageAvailable from '../../assests/noImageAvailable.jpg';
const ItemsBar = ({ transactionCode, itemsList, onClose }) => {
  const { openDropDown } = useDropdownStore();
  const { lang } = useLanguage();

  const isOpen = openDropDown === 'itemsBar' && transactionCode; // ✅

  return ReactDom.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="w-full h-dvh min-h-dvh
         bg-black/80 fixed inset-0 z-50 flex justify-end"
        >
          <motion.div
            initial={{ x: lang === 'en' ? 300 : -300 }}
            animate={{ x: 0 }}
            exit={{ x: lang === 'en' ? 300 : -300 }}
            transition={{ type: 'tween', duration: 0.4 }}
            className={`w-[300px] min-h-full overflow-auto bg-white flex flex-col ${
              lang === 'en' ? 'rounded-l-md' : 'rounded-r-md'
            }`}
          >
            {/* Header */}
            <div className="w-full h-20 bg-gray-100 grid grid-cols-5 p-4">
              <div className="col-span-4 flex flex-col">
                <h1 className="text-incentiveTextPrimary font-outfit font-bold">
                  {lang === 'en' ? 'Items' : 'ألعناصر'}
                </h1>
                <p className="text-[0.820rem] text-incentiveTextPrimary mt-0.5">
                  <span>{lang === 'en' ? 'Showing' : 'يعرض'}</span>{' '}
                  <span className="text-blue-700 font-poppins font-bold">
                    {itemsList?.length}
                  </span>{' '}
                  {lang === 'en' ? 'items' : 'عناصر'}
                </p>
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={onClose}
                  className="text-incentiveTextPlaceholder cursor-pointer hover:text-incentiveTextPrimary"
                >
                  <RiCloseLargeFill size={18} />
                </button>
              </div>
            </div>

            {/* Items List */}
            {itemsList?.map((item) => (
              <div
                key={item?.articleCode}
                className="w-full h-fit flex gap-4 p-4 border-b border-incentiveBorder"
              >
                {/* Image container */}
                <div className="h-full">
                  <span className="w-[74px] h-[74px] block rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={item?.itemImageUrl || noImageAvailable}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = noImageAvailable;
                      }}
                      alt="item image"
                      className="w-full h-full object-cover"
                    />
                  </span>
                </div>

                {/* Item info */}
                <div className="flex-1 flex flex-col gap-1 p-0.5">
                  <p className="text-[0.820rem] text-incentiveTextSecondary">
                    #{item?.articleCode}
                  </p>
                  <p className="text-sm text-incentiveTextPrimary font-outfit font-semibold">
                    {(item?.itemName[lang] || '').length > 40
                      ? (item?.itemName[lang] || '').slice(0, 40) + '...'
                      : item?.itemName[lang]}
                  </p>
                  <p className="text-sm text-blue-600 font-semibold font-poppins">
                    {item?.itemPrice.toLocaleString()} {currency[lang]}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,

    document.body,
  );
};

export default ItemsBar;
