import { WorkflowCost } from '@civitai/client';
import {
  ActionIcon,
  createStyles,
  Group,
  NumberInput,
  Popover,
  PopoverProps,
  Text,
} from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconInfoCircle } from '@tabler/icons-react';
import React from 'react';
import { CurrencyIcon } from '~/components/Currency/CurrencyIcon';
import {
  DescriptionTable,
  Props as DescriptionTableProps,
} from '~/components/DescriptionTable/DescriptionTable';
import { useTipStore } from '~/store/tip.store';

const getEmojiByValue = (value: number) => {
  if (value === 0) return '😢';
  if (value < 5) return '🙂';
  if (value < 15) return '😃';
  if (value < 20) return '😁';
  if (value < 35) return '😍';
  return '😇';
};

const useStyles = createStyles((theme) => ({
  tableCell: {
    height: '50px !important',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? `${theme.colors.dark[6]} !important`
        : `${theme.white} !important`,
  },

  baseCostCell: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? `${theme.colors.dark[4]} !important`
        : `${theme.colors.gray[1]} !important`,
  },
}));

export function GenerationCostPopover({
  children,
  workflowCost,
  readOnly,
  disabled,
  hideCreatorTip,
  ...popoverProps
}: Props) {
  const { classes, cx } = useStyles();
  const { civitaiTip, creatorTip } = useTipStore((state) => ({
    creatorTip: state.creatorTip * 100,
    civitaiTip: state.civitaiTip * 100,
  }));

  const handleShowExplanationClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    openModal({
      title: 'Generation Cost Breakdown',
      centered: true,
      children: <BreakdownExplanation />,
    });
  };

  const items: DescriptionTableProps['items'] = [
    {
      label: 'Quantity',
      value: <Text align="right">{Math.ceil(workflowCost.factors?.quantity ?? 0)}x</Text>,
      visible: !!workflowCost.factors?.quantity && workflowCost.factors?.quantity > 1,
      className: classes.tableCell,
    },
    {
      label: 'Size',
      value: <Text align="right">{Math.ceil(workflowCost.factors?.size ?? 0)}x</Text>,
      visible: !!workflowCost.factors?.size && workflowCost.factors?.size > 1,
      className: classes.tableCell,
    },
    {
      label: 'Steps',
      value: (
        <Text align="right">{Math.round(((workflowCost.factors?.steps ?? 0) - 1) * 100)}%</Text>
      ),
      visible: !!workflowCost.factors?.steps && workflowCost.factors?.steps !== 1,
      className: classes.tableCell,
    },
    {
      label: 'Sampler',
      value: (
        <Text align="right">{Math.round(((workflowCost.factors?.scheduler ?? 0) - 1) * 100)}%</Text>
      ),
      visible: !!workflowCost.factors?.scheduler && workflowCost.factors?.scheduler !== 1,
      className: classes.tableCell,
    },
    {
      label: <div className="font-bold">Base Cost</div>,
      value: (
        <Group spacing={4} position="right" className="font-bold" noWrap>
          {workflowCost.base ?? '0'}
          <CurrencyIcon currency="BUZZ" size={16} />
        </Group>
      ),
      className: cx(classes.tableCell, classes.baseCostCell),
    },
    {
      label: (
        <div className="flex items-center justify-between">
          Creator Tip{' '}
          <NumberInput
            value={creatorTip}
            onChange={(value = 0) => useTipStore.setState({ creatorTip: value / 100 })}
            min={0}
            max={100}
            w={110}
            step={5}
            classNames={{ input: 'pr-[30px] text-end' }}
            icon={getEmojiByValue(creatorTip)}
            formatter={(value) => {
              if (!value) return '0%';
              const parsedValue = parseFloat(value);

              return !Number.isNaN(parsedValue) ? `${parsedValue}%` : '0%';
            }}
          />
        </div>
      ),
      value: (
        <Group spacing={4} position="right" noWrap>
          {Math.ceil(((workflowCost.base ?? 0) * creatorTip) / 100)}
          <CurrencyIcon currency="BUZZ" size={16} />
        </Group>
      ),
      visible: !readOnly && !hideCreatorTip,
      className: classes.tableCell,
    },
    {
      label: 'Creator Tip',
      value: (
        <Group spacing={4} position="right" noWrap>
          {workflowCost.tips?.creators ?? '0'}
          <CurrencyIcon currency="BUZZ" size={16} />
        </Group>
      ),
      visible: !!readOnly && !!workflowCost.tips?.creators,
      className: classes.tableCell,
    },
    {
      label: (
        <div className="flex items-center justify-between">
          Civitai Tip{' '}
          <NumberInput
            value={civitaiTip}
            onChange={(value = 0) => useTipStore.setState({ civitaiTip: value / 100 })}
            min={0}
            max={100}
            w={110}
            step={5}
            defaultValue={0}
            classNames={{ input: 'pr-[30px] text-end' }}
            icon={getEmojiByValue(civitaiTip ?? 0)}
            formatter={(value) => {
              if (!value) return '%';
              const parsedValue = parseFloat(value);

              return !Number.isNaN(parsedValue) ? `${parsedValue}%` : '%';
            }}
          />
        </div>
      ),
      value: (
        <Group spacing={4} position="right" noWrap>
          {Math.ceil(((workflowCost.base ?? 0) * civitaiTip) / 100)}
          <CurrencyIcon currency="BUZZ" size={16} />
        </Group>
      ),
      visible: !readOnly,
      className: classes.tableCell,
    },
    {
      label: 'Civitai Tip',
      value: (
        <Group spacing={4} position="right" noWrap>
          {workflowCost.base ?? '0'}
          <CurrencyIcon currency="BUZZ" size={16} />
        </Group>
      ),
      visible: !!readOnly && !!workflowCost.tips?.civitai,
      className: classes.tableCell,
    },
  ];

  if (disabled) return <>{children}</>;

  return (
    <Popover shadow="md" {...popoverProps}>
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown p={0}>
        <DescriptionTable
          title={
            <div
              className={cx(classes.baseCostCell, 'flex items-center justify-between gap-4 p-2')}
            >
              <div className="font-semibold">Generation Cost Breakdown</div>
              <ActionIcon variant="subtle" radius="xl" onClick={handleShowExplanationClick}>
                <IconInfoCircle size={18} />
              </ActionIcon>
            </div>
          }
          items={items}
          withBorder={false}
        />
      </Popover.Dropdown>
    </Popover>
  );
}

function BreakdownExplanation() {
  return (
    <ul className="list-inside list-none text-sm">
      <li className="mb-2">
        <span className="font-semibold">Base Cost:</span>
        {` The base cost of generating an image is
        ⚡1 for 512x512 at 30 steps with a basic sampler. Flux's base cost is currently driven by
        our underlying provider. We'll continue to improve this as we onboard additional providers.`}
      </li>
      <li className="mb-2">
        <span className="font-semibold">Size Multiplier:</span> Based on the size difference between
        what you&apos;re requesting and the base resolution for your image, we charge a Size
        Multiplier. For example SDXL at 1024x1024 will have a multiplier of 4x.
      </li>
      <li className="mb-2">
        <span className="font-semibold">Step Multiplier:</span> Basic generations cover 30 steps, if
        you do more or less than that, the amount you are charged is adjusted accordingly.
      </li>
      <li className="mb-2">
        <span className="font-semibold">Sampler Multiplier:</span> Some samplers cause generation to
        take more time and because of that increase the total cost of generating.
      </li>
      <li className="mb-2">
        <span className="font-semibold">Workflow Cost:</span> Some workflows cost extra because they
        take extra time to run on our hardware.
      </li>
      <li className="mb-2">
        <span className="font-semibold">Creator Tip:</span> Show appreciation to the creator of the
        resources that you&apos;re using by including a tip. All tips go directly to the creators of
        the resources you use for generating. To show our appreciation to creators, this starts at
        25% but you can set it to whatever you think is right.
      </li>
      <li className="mb-2">
        <span className="font-semibold">Civitai Tip:</span> Love Civitai and want to show extra
        appreciation? Include a tip for us 😍
      </li>
    </ul>
  );
}

type Props = Omit<PopoverProps, 'children'> & {
  children: React.ReactNode;
  workflowCost: WorkflowCost;
  readOnly?: boolean;
  disabled?: boolean;
  hideCreatorTip?: boolean;
};
