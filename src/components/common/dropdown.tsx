import { Fragment, ReactNode } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid';

type Props<T> = {
  value: T;
  items: T[];
  onChange: (val: T) => void;
  renderFn: (val: T) => ReactNode;
}


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function Dropdown<T = string>(props: Props<T>) {

  function handleSelectedValue(value: T) {
    props.onChange(value);
  }

  return (
    <Listbox value={props.value} onChange={handleSelectedValue}>
      {({ open }) => (
        <>
          <div className="relative w-full">
            <Listbox.Button className="btn w-full btn-primary btn-outline pr-5">
              <span className="block truncate">{props.renderFn(props.value)}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {props.items.map((item, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-indigo-600" : "text-gray-900",
                        "cursor-default select-none relative py-2 pl-3 pr-9"
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {props.renderFn(item)}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}