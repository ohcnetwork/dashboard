import {
  Button,
  Card,
  Dropdown,
  HelperText,
  Input,
  Label,
} from "@saanuregh/react-ui";
import DateRangePicker from "@wojtekmaj/react-daterange-picker/dist/entry.nostyle";
import fuzzysort from "fuzzysort";
import React, { useState } from "react";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import { Calendar, ChevronDown } from "react-feather";

import { CONTENT, FACILITY_TYPES } from "../../utils/constants";

function Filter({
  timeseries,
  setTimeseries,
  date,
  dateOnChange,
  dates,
  datesOnChange,
  maxDate,
  floating,
  filterFacilityTypes,
  setFilterFacilityTypes,
  content,
}) {
  const [facilityTypesFilterOptions, setFacilityTypesFilterOptions] = useState(
    FACILITY_TYPES
  );
  const [_filterFacilityTypes, _setFilterFacilityTypes] = useState(
    filterFacilityTypes
  );
  const [facilityTypeFilterOpen, setFacilityTypeFilterOpen] = useState(false);
  const resetFacilityTypeFilter = () => {
    setFacilityTypeFilterOpen(false);
    setFacilityTypesFilterOptions(FACILITY_TYPES);
  };

  return (
    <div>
      <div
        className={`${
          floating
            ? "absolute inset-x-0 top-0 mt-10 z-40 flex-shrink-0 "
            : "mb-8 rounded-lg"
        } flex flex-col md:flex-row items-center justify-between px-4 py-2 bg-white shadow-md dark:bg-gray-800`}
      >
        <p className="hidden dark:text-gray-400 md:block">Filters</p>
        <div className="flex space-x-2">
          {content !== CONTENT.COVID && (
            <div className="dark:bg-gray-900 bg-white rounded-lg relative">
              <Button
                layout="link"
                onClick={() =>
                  setFacilityTypeFilterOpen(!facilityTypeFilterOpen)
                }
                iconRight={ChevronDown}
                className="shadow-xs"
              >
                Facility Type
              </Button>
              <Dropdown
                isOpen={facilityTypeFilterOpen}
                align="right"
                onClose={() => resetFacilityTypeFilter()}
                className="z-40"
              >
                <Label className="mb-2">
                  <div className="flex space-x-2">
                    <Input
                      className="dark:bg-gray-900"
                      placeholder="Search facility types"
                      onChange={(e) => {
                        setFacilityTypesFilterOptions(
                          e.target.value
                            ? fuzzysort
                                .go(e.target.value, facilityTypesFilterOptions)
                                .map((v) => v.target)
                            : FACILITY_TYPES
                        );
                      }}
                    />
                    <Button
                      layout="link"
                      onClick={() => _setFilterFacilityTypes([])}
                      className="dark:bg-gray-900 shadow-xs"
                    >
                      Clear
                    </Button>
                    <Button
                      layout="link"
                      onClick={() => _setFilterFacilityTypes(FACILITY_TYPES)}
                      className="dark:bg-gray-900 shadow-xs"
                    >
                      All
                    </Button>
                  </div>

                  <HelperText className="ml-1">
                    {`Selected ${_filterFacilityTypes.length} items`}
                  </HelperText>
                </Label>

                <Card className="flex flex-col h-64 mb-2 overflow-y-auto p-2">
                  {facilityTypesFilterOptions.map((d, i) => (
                    <Label key={i} check>
                      <Input
                        onClick={() => {
                          const _t = _filterFacilityTypes.findIndex(
                            (t) => t === d
                          );
                          const _tmp = [..._filterFacilityTypes];
                          if (_t > -1) {
                            _tmp.splice(_t, 1);
                          } else {
                            _tmp.push(d);
                          }
                          _setFilterFacilityTypes(_tmp);
                        }}
                        type="checkbox"
                        checked={_filterFacilityTypes.includes(d)}
                      />
                      <span className="ml-2">{d}</span>
                    </Label>
                  ))}
                </Card>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setFilterFacilityTypes(_filterFacilityTypes)}
                    className="shadow-xs"
                  >
                    Apply
                  </Button>
                  <Button
                    onClick={() => resetFacilityTypeFilter()}
                    className="shadow-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </Dropdown>
            </div>
          )}

          <div className="dark:bg-gray-900 bg-white rounded-lg flex dark:text-gray-700">
            <Button
              layout="link"
              onClick={() => setTimeseries(false)}
              className="rounded-r-none shadow-xs"
              disabled={!timeseries}
            >
              <span className="capitalize">Single</span>
            </Button>
            <Button
              layout="link"
              onClick={() => setTimeseries(true)}
              className="rounded-l-none shadow-xs"
              disabled={timeseries}
            >
              <span className="capitalize">Range</span>
            </Button>
          </div>
          <div className="hidden md:block">
            {!timeseries ? (
              <DatePicker
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={false}
                calendarIcon={
                  <Calendar className="dark:text-gray-400 text-gray-600" />
                }
                clearIcon={null}
                calendarClassName="p-1 font-sans bg-white rounded-lg dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-green-500"
                tileClassName="font-sans rounded-lg p-2"
                className="focus-within:shadow-outline-gray dark:hover:bg-gray-500 dark:hover:text-gray-300 dark:hover:bg-opacity-10 hover:bg-gray-100 dark:bg-gray-900 active:bg-transparent border-transparent rounded-lg border shadow-xs cursor-pointer font-sans text-sm font-medium focus-within:outline-none px-2 dark:text-gray-400 text-gray-600 duration-150 transition-colors"
                value={date}
                onChange={dateOnChange}
                maxDate={maxDate}
                format="dd/MM/yyyy"
              />
            ) : (
              <DateRangePicker
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={false}
                calendarIcon={
                  <Calendar className="dark:text-gray-400 text-gray-600" />
                }
                clearIcon={null}
                calendarClassName="p-1 font-sans bg-white rounded-lg dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-green-500"
                tileClassName="font-sans rounded-lg p-2"
                className="focus-within:shadow-outline-gray dark:hover:bg-gray-500 dark:hover:text-gray-300 dark:hover:bg-opacity-10 hover:bg-gray-100 dark:bg-gray-900 active:bg-transparent border-transparent rounded-lg border shadow-xs cursor-pointer font-sans text-sm font-medium focus-within:outline-none px-2 dark:text-gray-400 text-gray-600 duration-150 transition-colors"
                value={dates}
                onChange={datesOnChange}
                maxDate={maxDate}
                format="dd/MM/yyyy"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;
