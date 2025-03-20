'use client';

import { Suspense, use, useEffect, useRef, useState } from 'react';
import HeaderTitle from '@/app/(create)/_components/headerTitle/HeaderTitle';
import SmallActionChip from '@/app/(create)/_components/smallActionChip/SmallActionChip';
import ClearableInput from '@/components/clearableInput/ClearableInput';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { TaskResponse } from '@/types/task';
import { api } from '@/lib/ky';
import { useRouter } from 'next/navigation';
import { EditPageProps } from '../../context';
import { Loader } from 'lucide-react';

const WAITING_TIME = 200;
const MAX_SMALL_ACTION_LENGTH = 15;
const SMALL_ACTION_LIST = ['SitAtTheDesk', 'TurnOnTheLaptop', 'DrinkWater'];

const SmallActionEdit = ({ params }: EditPageProps) => {
  const { taskId } = use(params);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isFocused, setIsFocused] = useState(true);
  const [smallAction, setSmallAction] = useState<string>('');

  const { data: taskData, isPending } = useQuery<TaskResponse>({
    queryKey: ['singleTask', taskId],
    queryFn: async () =>
      await api.get(`v1/tasks/${taskId}`).json<TaskResponse>(),
  });

  const handleSmallActionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSmallAction(event.target.value);
  };

  const handleInputFocus = (value: boolean) => {
    setIsFocused(value);
  };

  const handleSmallActionClick = (action: string) => {
    setSmallAction(action);
  };

  const handleNextButtonClick = () => {
    const query = new URLSearchParams({
      triggerAction: smallAction,
    }).toString();

    router.push(`/edit/buffer-time/${taskId}?${query}&type=smallAction`);
  };

  useEffect(() => {
    if (inputRef.current)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          setIsFocused(true);
        }
      }, WAITING_TIME);
  }, []);

  useEffect(() => {
    if (taskData) {
      setSmallAction(taskData.triggerAction);
    }
  }, [taskData]);

  return (
    <div className="flex h-screen w-full flex-col justify-between">
      {isPending ? (
        <div className="flex h-screen w-full items-center justify-center bg-background-primary px-5 py-12">
          <Loader />
        </div>
      ) : (
        <>
          <div>
            <HeaderTitle title="어떤 작은 행동부터 시작할래요?" />
            <div className="flex flex-col gap-6">
              <div>
                <ClearableInput
                  value={smallAction}
                  ref={inputRef}
                  title="작은 행동 입력"
                  isFocused={isFocused}
                  onChange={handleSmallActionChange}
                  handleInputFocus={handleInputFocus}
                />
                {smallAction.length > MAX_SMALL_ACTION_LENGTH && (
                  <p className="mt-2 text-sm text-red-500">
                    최대 16자 이내로 입력할 수 있어요.
                  </p>
                )}
                {smallAction.length === 0 && (
                  <div className="mt-3 flex w-full gap-2 overflow-x-auto whitespace-nowrap">
                    {SMALL_ACTION_LIST.map((action, index) => (
                      <SmallActionChip
                        key={index}
                        smallAction={action}
                        onClick={handleSmallActionClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className={`transition-all duration-300 ${isFocused ? 'mb-[48vh]' : 'pb-[46px]'}`}
          >
            <Button
              variant="primary"
              className="w-full"
              disabled={
                smallAction.length === 0 ||
                smallAction.length > MAX_SMALL_ACTION_LENGTH
              }
              onClick={handleNextButtonClick}
            >
              확인
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

const SmallActionEditPage = (props: EditPageProps) => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background-primary px-5 py-12">
          <Loader />
        </div>
      }
    >
      <SmallActionEdit {...props} />
    </Suspense>
  );
};

export default SmallActionEditPage;
