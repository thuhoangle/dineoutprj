/* eslint-disable @next/next/no-img-element */
'use client';
import { useUserStore } from '@/stores';
import {
  EditRestaurantProps,
  useUpdateRestaurantInfo,
  useUploadImage,
} from '@/hooks';
import clsx from 'clsx';
import {
  Input,
  Select,
  SelectItem,
  Textarea,
  Image,
  Radio,
  RadioGroup,
  Accordion,
  AccordionItem,
  NumberInput,
} from '@heroui/react';
import { useWindowContext } from '@/contexts';
import { Button, SimpleLoading } from 'dineout-ui';
import { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { FiUpload } from 'react-icons/fi';

export const ProfilePanel = () => {
  const authInfo = useUserStore((state) => state.authInfo);
  const { isMobileMode } = useWindowContext();

  const { updateUser, fetching, query, setQuery } = useUpdateRestaurantInfo();
  const { uploading, uploadImages } = useUploadImage({
    id: authInfo?.id,
    onUpload: (imageUrls) => {
      _setParams({
        ...params,
        images: [...(params.images || []), ...imageUrls],
      });
    },
  });

  const [params, setParams] = useState<EditRestaurantProps>(query);

  useEffect(() => {
    if (!!params) {
      setParams(query);
    }
  }, [query]);

  const _setParams = (params: EditRestaurantProps) => {
    setParams(params);
    setQuery((prev) => ({ ...prev, ...params }));
  };

  const handleDeleteImage = (imageUrl: string) => {
    const updatedImages =
      params.images?.filter((img) => img !== imageUrl) || [];
    setParams({ ...params, images: updatedImages });
  };

  const _handleSave = async () => {
    await setQuery({ ...params });

    updateUser();
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        className={clsx(
          'relative border-1.5 border-gray-100 flex flex-col mt-2 p-5 rounded-md shadow-lg gap-5',
          isMobileMode ? 'px-5' : 'px-10'
        )}
      >
        <div className="text-3xl font-bold">Restaurant Information</div>

        {!!params.images?.length ? (
          <div className="flex flex-wrap items-center gap-3">
            {params.images?.map((image) => (
              <div
                key={image}
                className="relative flex flex-col items-center gap-3"
              >
                <div className="relative z-0">
                  <Image
                    className="object-cover"
                    height={200}
                    width={200}
                    src={image}
                    alt="restaurant image"
                  />
                  <MdOutlineCancel
                    className="absolute cursor-pointer z-10 top-2 right-2 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => handleDeleteImage(image)}
                  />
                </div>
              </div>
            ))}
            <div className="self-center">
              <label
                className="flex gap-1 font-semibold text-[16px] cursor-pointer flex-col items-center justify-center h-[200px] w-[200px] p-3 rounded-[14px] bg-gray-100 border-2 border-gray-300"
                htmlFor="images-upload"
              >
                {uploading ? 'Uploading' : 'Upload Images'}
                {uploading ? (
                  <SimpleLoading size={20} />
                ) : (
                  <FiUpload className="h-5 w-5" />
                )}
              </label>
              <input
                id="images-upload"
                type="file"
                accept="image/*"
                multiple
                style={{
                  visibility: 'hidden',
                  position: 'absolute',
                }}
                onChange={uploadImages}
                disabled={uploading}
              />
            </div>
          </div>
        ) : (
          <div className="self-center">
            <label
              className="text-[14px] flex gap-2 font-semibold items-center p-3 cursor-pointer rounded-md bg-transparent border-2 border-foreground-500"
              htmlFor="images-upload"
            >
              {uploading ? 'Uploading' : 'Upload Images'}
              {uploading ? (
                <SimpleLoading size={15} />
              ) : (
                <FiUpload className="h-5 w-5" />
              )}
            </label>
            <input
              id="images-upload"
              type="file"
              accept="image/*"
              multiple
              style={{
                visibility: 'hidden',
                position: 'absolute',
              }}
              onChange={uploadImages}
              disabled={uploading}
            />
          </div>
        )}
        <div
          className={clsx('justify-center items-center flex flex-col gap-4')}
        >
          <Input
            className="w-full"
            label="Restaurant Name"
            value={params.name || ''}
            onChange={(e) => _setParams({ ...params, name: e.target.value })}
          />
          <Input
            label="Phone number"
            className="w-full"
            value={params.phone || ''}
            onChange={(e) => _setParams({ ...params, phone: e.target.value })}
          />
          <Textarea
            label="Overview"
            className="w-full"
            value={params.overview || ''}
            onChange={(e) =>
              _setParams({ ...params, overview: e.target.value })
            }
          />
          <Input
            label="Short Bio"
            description="To display in the small bio section"
            className="w-full"
            value={params.short_overview || ''}
            onValueChange={(value) =>
              _setParams({ ...params, short_overview: value })
            }
          />
          <div className="flex justify-between w-full items-start gap-8">
            <RadioGroup
              size="sm"
              color="danger"
              className="w-full flex"
              orientation="horizontal"
              defaultValue={params.price_range?.toString() || ''}
              label="Select Price Range"
              onValueChange={(value) =>
                _setParams({ ...params, price_range: Number(value) })
              }
            >
              <Radio value="1">$</Radio>
              <Radio value="2">$$</Radio>
              <Radio value="3">$$$</Radio>
            </RadioGroup>

            <Input
              value={params.price}
              label="Price Range in specific(optional)"
              placeholder="Enter the amount"
              labelPlacement="outside"
              onChange={(e) => _setParams({ ...params, price: e.target.value })}
            />
          </div>
          <Accordion
            defaultExpandedKeys={['website']}
            isCompact
            // variant="bordered"
            itemClasses={{
              trigger: '!py-2',
              heading: 'px-3',
              title: '!text-[16px] text-default-600',
              content: '!py-0',
              base: 'bg-[#F4F4F5] rounded-xl !-mx-3',
            }}
          >
            <AccordionItem
              key="website"
              aria-label="url"
              title="Websites"
              classNames={{
                content: 'flex flex-col gap-2 px-3 pb-4',
              }}
            >
              <Input
                variant="underlined"
                label="Website"
                className="w-full"
                value={params.website || ''}
                onValueChange={(value) =>
                  _setParams({ ...params, website: value })
                }
              />
              <Input
                variant="underlined"
                label="Google Map URL"
                className="w-full"
                value={params.ggUrl || ''}
                onValueChange={(value) =>
                  _setParams({ ...params, ggUrl: value })
                }
              />
            </AccordionItem>
          </Accordion>
          <Accordion
            isCompact
            itemClasses={{
              trigger: '!py-2',
              heading: 'px-3',
              title: '!text-[16px] text-default-600',
              content: '!py-0',
              base: 'bg-[#F4F4F5] rounded-xl !-mx-3',
            }}
          >
            <AccordionItem
              key="working-time"
              aria-label="url"
              title="Working Time"
              classNames={{
                content: 'flex flex-col gap-2 px-3 pb-4',
              }}
            >
              <Accordion
                isCompact
                itemClasses={{
                  trigger: '!py-2',
                  heading: 'px-3',
                  title: '!text-[16px] text-default-600',
                  content: '!py-0',
                  base: 'bg-[#F4F4F5] rounded-xl !-mx-3',
                }}
              >
                {[
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ].map((day) => (
                  <AccordionItem
                    key={day.toLowerCase()}
                    aria-label={day}
                    title={day}
                    classNames={{
                      content: 'flex items-center gap-2 px-3 pb-4',
                      title: '!text-foreground',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <Input
                        label="Opening Time"
                        placeholder="9 AM"
                        value={
                          params.opening_hours?.[day]?.split(' to ')[0] ||
                          '9 AM'
                        }
                        onChange={(e) => {
                          const closingTime =
                            params.opening_hours?.[day]?.split(' to ')[1] ||
                            '11 PM';
                          _setParams({
                            ...params,
                            opening_hours: {
                              ...params.opening_hours,
                              [day]: `${e.target.value} to ${closingTime}`,
                            },
                          });
                        }}
                        className="w-full"
                      />
                      <Input
                        label="Closing Time"
                        placeholder="11 PM"
                        value={
                          params.opening_hours?.[day]?.split(' to ')[1] ||
                          '11 PM'
                        }
                        onChange={(e) => {
                          const openingTime =
                            params.opening_hours?.[day]?.split(' to ')[0] ||
                            '9 AM';
                          _setParams({
                            ...params,
                            opening_hours: {
                              ...params.opening_hours,
                              [day]: `${openingTime} to ${e.target.value}`,
                            },
                          });
                        }}
                        className="w-full"
                      />
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionItem>
          </Accordion>
          <div className="flex w-full items-center gap-2">
            <Input
              label="Address"
              className="w-full"
              value={params.locations?.address || ''}
              onValueChange={(value) =>
                _setParams({
                  ...params,
                  locations: {
                    ...(params.locations || {}),
                    address: value,
                    neighborhood: params.locations?.neighborhood || '',
                    lat: params.locations?.lat || 0,
                    lng: params.locations?.lng || 0,
                    countryCode: params.locations?.countryCode || 'VN',
                    city: params.locations?.city || 'Ho Chi Minh City',
                  },
                })
              }
            />
            <Input
              label="Ward"
              className="w-full"
              value={params.locations?.neighborhood || ''}
              onValueChange={(value) =>
                _setParams({
                  ...params,
                  locations: {
                    ...(params.locations || {}),
                    neighborhood: value,
                    address: params.locations?.address || '',
                    lat: params.locations?.lat || 0,
                    lng: params.locations?.lng || 0,
                    countryCode: params.locations?.countryCode || 'VN',
                    city: params.locations?.city || 'Ho Chi Minh City',
                  },
                })
              }
            />
            <Select
              isRequired
              selectedKeys={params.district ? [params.district] : []}
              onSelectionChange={(keys) =>
                _setParams({ ...params, district: String(Array.from(keys)[0]) })
              }
              label="District"
              placeholder="Select a district"
            >
              {Districts.map((item) => (
                <SelectItem key={item}>{item}</SelectItem>
              ))}
            </Select>
          </div>
          <Textarea
            label="Reservation Policy"
            description="We will share the reservation policy publicly with customers in the Reservation page."
            value={params.reservation_policy || ''}
            onValueChange={(value) =>
              _setParams({ ...params, reservation_policy: value })
            }
          />
          <Textarea
            label="Cancellation Policy"
            description="We will share the cancellation policy publicly with customers in the Reservation page."
            value={params.cancellation_policy || ''}
            onValueChange={(value) =>
              _setParams({ ...params, cancellation_policy: value })
            }
          />
          <div className="mt-10 w-full">
            <Button
              // disabled={JSON.stringify(params) === JSON.stringify(query)}
              size="xl"
              className="w-full !p-3 bg-red-500 text-white"
              text="Save"
              fetching={fetching}
              onClick={_handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Districts = [
  'District 1',
  'District 2',
  'District 3',
  'District 4',
  'District 5',
  'District 6',
  'District 7',
  'District 8',
  'Thu Duc District',
  'Binh Tan District',
  'Binh Chanh District',
  'Hoc Mon District',
  'Nha Be District',
  'Tan Binh District',
  'Tan Phu District',
  'Phu Nhuan District',
  'Go Vap District',
];
