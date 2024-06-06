'use client'

import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
  useId,
} from 'react'

type AccordionContextType = {
  multiple: boolean
  expandedItems: string[]
  setExpandedItems: (newState: (state: string[]) => string[]) => void
}

const AccordionContext = createContext<AccordionContextType>({
  multiple: false,
  expandedItems: [],
  setExpandedItems: () => {},
})

export const AccordionItem = ({
  title,
  expanded = false,
  children,
}: PropsWithChildren<{ title: string; expanded?: boolean }>) => {
  const { multiple, expandedItems, setExpandedItems } =
    useContext(AccordionContext)
  const id = useId()

  useEffect(() => {
    if (expanded === true) {
      setExpandedItems((expandedItems) => {
        expandedItems.push(id)
        return expandedItems
      })
    }
  }, [])

  const toggle = () => {
    setExpandedItems((expandedItems) => {
      const isExpanded = expandedItems.includes(id)

      if (isExpanded) {
        console.log('Close', id)
        return expandedItems.filter((item) => item !== id)
      }

      if (!multiple) {
        console.log('Open only', id)
        return [id]
      }

      return [...expandedItems, id]
    })
  }

  return (
    <>
      <button
        aria-selected={expandedItems.includes(id)}
        aria-controls={`${id}-panel`}
        className="accordion__trigger"
        onClick={toggle}
        role="tab"
        aria-label={title}
        id={`${id}-trigger`}
      >
        <span className="screenreader-text">
          {expandedItems ? 'Close' : 'Expand'}
        </span>

        {title}
      </button>

      <div
        className="accordion__content"
        role="tabpanel"
        aria-labelledby={`${id}-trigger`}
        id={`${id}-panel`}
      >
        {children}
      </div>
    </>
  )
}

export const Accordion = ({
  multiple = false,
  children,
}: PropsWithChildren<{ multiple?: boolean }>) => {
  const [expandedItemsStorage, setExpandedItemsStorage] = useState<string[]>([])

  const setExpandedItems = (newState: (state: string[]) => string[]) => {
    setExpandedItemsStorage((items) => [...new Set(newState(items))])
  }

  useEffect(() => {
    console.log(expandedItemsStorage)
  }, [expandedItemsStorage])

  return (
    <AccordionContext.Provider
      value={{
        multiple,
        expandedItems: expandedItemsStorage,
        setExpandedItems,
      }}
    >
      <div className="accordion" role="tablist" aria-multiselectable={multiple}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

export default Accordion
