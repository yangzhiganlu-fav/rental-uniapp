import { ref, reactive } from 'vue';

export function useRoomEdit() {
    // =================================================================================================
    // 1. 状态定义
    // =================================================================================================
    // 表单数据
    const formData = reactive({
        rentalStatus: '',
        price: '',
        keyLocation: '',
        remark: '',
        buildingNumber: '',
        unitNumber: '',
        roomNumber: '',
        // 0：楼梯房 1：电梯房
        hasElevator: 1,
        floor: [],
        area: '',
        roomArea: '',
        orientation: [],
    });

    // UI控制状态
    const rentalStatusShow = ref(false);
    const tempRentalStatus = ref([]);

    const keyLocationShow = ref(false);
    const tempKeyLocation = ref([]);

    const priceModalShow = ref(false);
    const tempPrice = ref('');

    const remarkModalShow = ref(false);
    const tempRemark = ref('');

    const roomModalShow = ref(false);
    const roomData = reactive({});

    const showFloorPicker = ref(false);

    const areaModalShow = ref(false);
    const tempArea = ref('');

    const roomAreaModalShow = ref(false);
    const tempRoomArea = ref('');

    const showOrientationPicker = ref(false);

    const roomNameModalShow = ref(false);
    const tempRoomName = ref('');

    const showCalendar = ref(false);

    // =================================================================================================
    // 2. 选项数据
    // =================================================================================================
    const rentalStatusOptions = reactive([
        [
            { label: '已租', value: '已租' },
            { label: '未租', value: '未租' },
        ],
    ]);

    const keyLocationOptions = reactive([
        [
            { label: '密码锁(请把固定密码写入备注)', value: '密码锁' },
            { label: '房东手里', value: '房东手里' },
            { label: '消防栓', value: '消防栓' },
            { label: '水表箱', value: '水表箱' },
            { label: '电表箱', value: '电表箱' },
            { label: '免寓', value: '免寓' },
            { label: '房屋门框', value: '房屋门框' },
            { label: '其他位置', value: '其他位置' },
            { label: '信箱', value: '信箱' },
            { label: '门口地毯', value: '门口地毯' },
            { label: '保安室', value: '保安室' },
            { label: '牛奶箱', value: '牛奶箱' },
        ],
    ]);

    const floorRange = [
        new Array(99).fill(0).map((_, i) => `第${i + 1}层`),
        new Array(99).fill(0).map((_, i) => `共${i + 1}层`),
    ];

    const orientationRange = [
        ['主卧', '次卧'],
        ['朝东', '朝南', '朝西', '朝北'],
    ];

    // =================================================================================================
    // 3. 业务逻辑
    // =================================================================================================

    // --- 出租状态逻辑 ---
    const openRentalStatusPicker = () => {
        tempRentalStatus.value = formData.rentalStatus ? [formData.rentalStatus] : [];
        rentalStatusShow.value = true;
    };

    const onRentalStatusConfirm = (e) => {
        formData.rentalStatus = e.value[0].value;
        rentalStatusShow.value = false;
    };

    // --- 钥匙位置逻辑 ---
    const openKeyLocationPicker = () => {
        tempKeyLocation.value = formData.keyLocation ? [formData.keyLocation] : [];
        keyLocationShow.value = true;
    };

    const onKeyLocationConfirm = (e) => {
        formData.keyLocation = e.value[0].value;
        keyLocationShow.value = false;
    };

    // --- 对外报价逻辑 ---
    const openPriceModal = () => {
        tempPrice.value = formData.price;
        priceModalShow.value = true;
    };

    const onPriceConfirm = () => {
        if (!tempPrice.value) {
            uni.showToast({
                title: '请输入对外报价',
                icon: 'none',
            });
            return;
        }
        formData.price = tempPrice.value;
        priceModalShow.value = false;
    };

    const onPriceClose = () => {
        tempPrice.value = '';
    };

    // --- 房东备注逻辑 ---
    const openRemarkModal = () => {
        tempRemark.value = formData.remark;
        remarkModalShow.value = true;
    };

    const onRemarkConfirm = () => {
        formData.remark = tempRemark.value;
        remarkModalShow.value = false;
    };

    const onRemarkClose = () => {
        tempRemark.value = '';
    };

    // --- 房间信息逻辑 (楼号/单元/室号) ---
    const openRoomModal = () => {
        roomData.buildingNumber = formData.buildingNumber;
        roomData.unitNumber = formData.unitNumber;
        roomData.roomNumber = formData.roomNumber;
        roomModalShow.value = true;
    };

    const onRoomConfirm = (data) => {
        formData.buildingNumber = data.buildingNumber;
        formData.unitNumber = data.unitNumber;
        formData.roomNumber = data.roomNumber;
        roomModalShow.value = false;
    };

    const onRoomClose = () => {
        roomModalShow.value = false;
    };

    // --- 楼层逻辑 ---
    const openFloorPicker = () => {
        showFloorPicker.value = true;
    };

    const onFloorConfirm = (e) => {
        const floorVal = parseInt(e.value[0].replace(/\D/g, '')) - 1;
        const totalVal = parseInt(e.value[1].replace(/\D/g, '')) - 1;
        formData.floor = [floorVal, totalVal];
        showFloorPicker.value = false;
    };

    // --- 整套面积逻辑 ---
    const openAreaModal = () => {
        tempArea.value = formData.area;
        areaModalShow.value = true;
    };

    const onAreaConfirm = () => {
        if (!tempArea.value) {
            uni.showToast({
                title: '请输入整套面积',
                icon: 'none',
            });
            return;
        }
        formData.area = tempArea.value;
        areaModalShow.value = false;
    };

    const onAreaClose = () => {
        tempArea.value = '';
    };

    // --- 房间面积逻辑 ---
    const openRoomAreaModal = () => {
        tempRoomArea.value = formData.roomArea;
        roomAreaModalShow.value = true;
    };

    const onRoomAreaConfirm = () => {
        if (!tempRoomArea.value) {
            uni.showToast({
                title: '请输入房间面积',
                icon: 'none',
            });
            return;
        }
        formData.roomArea = tempRoomArea.value;
        roomAreaModalShow.value = false;
    };

    const onRoomAreaClose = () => {
        tempRoomArea.value = '';
    };

    // --- 房间朝向逻辑 ---
    const openOrientationPicker = () => {
        showOrientationPicker.value = true;
    };

    const onOrientationConfirm = (e) => {
        formData.orientation = e.value;
        showOrientationPicker.value = false;
    };

    // --- 房间名称逻辑 ---
    const openRoomNameModal = () => {
        tempRoomName.value = formData.roomName;
        roomNameModalShow.value = true;
    };

    const onRoomNameConfirm = () => {
        if (!tempRoomName.value) {
            uni.showToast({
                title: '请输入房间名称',
                icon: 'none',
            });
            return;
        }
        formData.roomName = tempRoomName.value;
        roomNameModalShow.value = false;
    };

    const onRoomNameClose = () => {
        tempRoomName.value = '';
    };

    return {
        // 状态
        formData,
        rentalStatusShow,
        tempRentalStatus,
        keyLocationShow,
        tempKeyLocation,
        priceModalShow,
        tempPrice,
        remarkModalShow,
        tempRemark,
        roomModalShow,
        roomData,
        showFloorPicker,
        areaModalShow,
        tempArea,
        roomAreaModalShow,
        tempRoomArea,
        showOrientationPicker,
        roomNameModalShow,
        tempRoomName,
        showCalendar,

        // 选项
        rentalStatusOptions,
        keyLocationOptions,
        floorRange,
        orientationRange,

        // 方法
        openRentalStatusPicker,
        onRentalStatusConfirm,
        openKeyLocationPicker,
        onKeyLocationConfirm,
        openPriceModal,
        onPriceConfirm,
        onPriceClose,
        openRemarkModal,
        onRemarkConfirm,
        onRemarkClose,
        openRoomModal,
        onRoomConfirm,
        onRoomClose,
        openFloorPicker,
        onFloorConfirm,
        openAreaModal,
        onAreaConfirm,
        onAreaClose,
        openRoomAreaModal,
        onRoomAreaConfirm,
        onRoomAreaClose,
        openOrientationPicker,
        onOrientationConfirm,
        openRoomNameModal,
        onRoomNameConfirm,
        onRoomNameClose,
    };
}
